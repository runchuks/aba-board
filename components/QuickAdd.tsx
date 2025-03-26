import useTranslation from "@/localization";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FC, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import STORAGE from "@/storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setItems } from "@/store/slices/global";

interface Props {
    groupId: number | null
    onDissmiss: () => void
    onAdd: () => void
}

enum STEP {
    PICTURE,
    NAME
}

const QuickAdd: FC<Props> = ({ groupId, onDissmiss, onAdd }) => {
    const theme = useTheme()
    const t = useTranslation()
    const [permission, requestPermission] = useCameraPermissions();
    const { lang, editingGroup } = useSelector((state: RootState) => state.global);
    const dispatch = useDispatch();

    const [step, setStep] = useState<STEP>(STEP.PICTURE)
    const [cameraFlashEnabled, setCameraFlashEnabled] = useState<boolean>(false)
    const [cameraReady, setCameraReady] = useState<boolean>(false)
    const [tempImage, setTempImage] = useState<string>('')
    const [tempName, setTempName] = useState<string>('')
    const [cameraError, setCameraError] = useState<string | null>(null);

    const camera = useRef<CameraView>(null)

    const takePicture = useCallback(() => {
        if (cameraReady) {
            camera.current?.takePictureAsync({ quality: 0.5, base64: true }).then((data) => {
                if (data?.uri) {
                    setTempImage(data.uri);
                    setCameraFlashEnabled(false);
                    setStep(STEP.NAME)
                    setCameraError(null);
                }
            }).catch((e) => {
                console.log('Error taking picture', e);
            });
        }
    }, [cameraReady]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setTempImage(result.assets[0].uri);
            setCameraFlashEnabled(false);
            setStep(STEP.NAME)
            setCameraError(null);
        }
    };

    const addItem = useCallback(async () => {
        let newPath = '';

        if (tempImage) {
            const now = Date.now();
            newPath = FileSystem.documentDirectory + `image-${now}.jpg`;

            await FileSystem.copyAsync({
                from: tempImage,
                to: newPath
            });
        }

        const newId = await STORAGE.addItem(tempName, lang, '', newPath);
        dispatch(setItems(await STORAGE.getAllItemsAsRecord()));

        if (editingGroup && newId) {
            // Update the group with the new item ID
            const group = await STORAGE.getGroup(editingGroup);
            if (group) {
                // Find the index of the array with the least items
                const leastItemsIndex = group.lists.reduce((minIndex, list, index, lists) => {
                    return list.length < lists[minIndex].length ? index : minIndex;
                }, 0);

                // Add the new item ID to the list with the least items
                group.lists[leastItemsIndex].push(newId);

                await STORAGE.updateGroupById(editingGroup, { lists: JSON.stringify(group.lists) });
                dispatch(setItems(await STORAGE.getAllItemsAsRecord()));
            }
        }

        onAdd()
    }, [dispatch, editingGroup, lang, onAdd, tempImage, tempName]);

    if (groupId === null) return null

    switch (step) {
        case STEP.PICTURE:
            return (
                <View
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {!permission ? (
                        <Text>{t('Loading permissions')}</Text>
                    ) : (
                        !permission.granted ? (
                            <Button
                                onPress={requestPermission}
                                mode="contained"
                            >{t('Request camera permission')}</Button>
                        ) : (
                            cameraError ? (
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: -40
                                    }}
                                >
                                    <Text style={{ color: theme.colors.error, marginBottom: 5, fontSize: 20 }}>{t('Camera error.')}</Text>
                                    <Button
                                        mode="contained"
                                        onPress={pickImage}
                                    >{t('Add from gallery')}</Button>
                                    <Text style={{ color: theme.colors.onPrimary, marginVertical: 5 }}>{t('or')}</Text>
                                    <Button
                                        mode="contained"
                                        onPress={() => setStep(STEP.NAME)}
                                    >
                                        {t('Skip image')}
                                    </Button>
                                </View>
                            ) : (
                                <CameraView
                                    style={{ width: '100%', height: '100%', borderRadius: theme.roundness }}
                                    facing="back"
                                    autofocus="on"
                                    ratio="1:1"
                                    enableTorch={cameraFlashEnabled}
                                    onCameraReady={() => setCameraReady(true)}
                                    onMountError={(e) => setCameraError(e.message)}
                                    animateShutter={false}
                                    ref={camera}
                                />
                            )

                        )

                    )}
                    <View
                        style={{
                            position: 'absolute',
                            width: '100%',
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            backgroundColor: theme.colors.backdrop
                        }}
                    >
                        <IconButton
                            icon="folder-multiple-image"
                            iconColor={theme.colors.primary}
                            onPress={pickImage}
                        />
                        <IconButton
                            icon="camera-iris"
                            iconColor={theme.colors.primary}
                            size={50}
                            disabled={!cameraReady || cameraError !== null}
                            onPress={() => {
                                takePicture();
                            }}
                        />
                        <IconButton
                            icon={cameraFlashEnabled ? 'flash' : 'flash-off'}
                            iconColor={theme.colors.secondary}
                            onPress={() => {
                                setCameraFlashEnabled(!cameraFlashEnabled);
                            }}
                        />
                    </View>
                    {!cameraError ? (
                        <View
                            style={{
                                position: 'absolute',
                                height: 50,
                                top: 5,
                                right: 5
                            }}
                        >
                            <Button
                                mode="outlined"
                                onPress={() => setStep(STEP.NAME)}
                            >
                                {t('Skip image')}
                            </Button>
                        </View>
                    ) : null}
                </View>

            )
        case STEP.NAME:
            return (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: theme.colors.background,
                        padding: 20,
                        borderRadius: theme.roundness,
                        overflow: 'hidden'
                    }}
                >
                    <TextInput
                        value={tempName}
                        onChangeText={setTempName}
                        label={t('Item name')}
                        autoFocus
                    />
                    <Button
                        mode="contained"
                        style={{ marginTop: 20 }}
                        onPress={() => addItem()}
                    >
                        {t('Add')}
                    </Button>
                </View>
            )
        default:
            return null
    }
}

export default QuickAdd
