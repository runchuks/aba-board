import useTranslation from "@/localization";
import { RootState } from "@/store";
import { CameraView } from "expo-camera";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Image } from "react-native";
import { Button, Dialog, IconButton, Portal, Snackbar, Surface, Text, TextInput, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from 'expo-file-system';
import STORAGE from "@/storage";
import { setItems, updateItemById } from "@/store/slices/global";

const EditItem: FC = () => {
    const theme = useTheme();
    const { items, editingGroup, editingColumn, lang } = useSelector((state: RootState) => state.global);
    const dispatch = useDispatch();
    const { itemId } = useLocalSearchParams<{ itemId: string }>();
    const navigation = useNavigation();
    const router = useRouter();
    const t = useTranslation();

    const [cameraFlashEnabled, setCameraFlashEnabled] = useState<boolean>(false);
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [showCamera, setShowCamera] = useState<boolean>(false);
    const [tempImage, setTempImage] = useState<string>('');
    const [showDoneSnack, setShowDoneSnack] = useState<boolean>(false);
    const [showChanges, setShowChanges] = useState<boolean>(false);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const camera = useRef<CameraView>(null);
    const cameraWrap = useRef(null);

    const isNewItem = itemId === '0';
    const item = isNewItem ? { name: '', image: '' } : items[parseInt(itemId, 10)];
    const [editName, setEditName] = useState<string>(item.name);
    const [removeImage, setRemoveImage] = useState<boolean>(false);

    const takePicture = useCallback(() => {
        if (cameraReady) {
            camera.current?.takePictureAsync({ quality: 0.5, base64: true }).then((data) => {
                if (data?.uri) {
                    setTempImage(data.uri);
                    setShowCamera(false);
                    setCameraFlashEnabled(false);
                    setHasChanges(true);
                }
            }).catch((e) => {
                console.log('Error taking picture', e);
            });
        }
    }, [cameraReady]);

    const saveItem = useCallback(async () => {
        setLoading(true);
        let newPath = '';

        if (tempImage) {
            const now = Date.now();
            newPath = FileSystem.documentDirectory + `image-${itemId}-${now}.jpg`;

            const { exists } = await FileSystem.getInfoAsync(item.image);
            if (exists) {
                await FileSystem.deleteAsync(item.image);
            }

            await FileSystem.copyAsync({
                from: tempImage,
                to: newPath
            });
        }

        if (isNewItem) {
            const newId = await STORAGE.addItem(editName, lang, '', newPath);
            dispatch(setItems(await STORAGE.getAllItemsAsRecord()));

            if (editingGroup && editingColumn !== null && newId) {
                // Update the group with the new item ID
                const group = await STORAGE.getGroup(editingGroup);
                if (group) {
                    console.log({ l: group.lists, newId })
                    group.lists[editingColumn].push(newId);
                    await STORAGE.updateGroupById(editingGroup, { lists: JSON.stringify(group.lists) });
                    dispatch(setItems(await STORAGE.getAllItemsAsRecord()));
                }
            }
            router.replace(`/board/edit/edit-item/${newId}`);
        } else {
            await STORAGE.updateItemById(Number(itemId), {
                name: editName,
                ...(newPath || removeImage ? { image: removeImage ? '' : newPath } : {})
            });
            dispatch(updateItemById({
                id: itemId,
                data: {
                    name: editName,
                    ...(newPath ? { image: newPath } : {})
                }
            }));
            setTempImage('');
            setHasChanges(false);
            setShowDoneSnack(true);
        }

        setLoading(false);
    }, [tempImage, isNewItem, itemId, item.image, editName, lang, dispatch, editingGroup, editingColumn, router, removeImage]);

    useEffect(() => {
        navigation.setOptions({
            title: t(isNewItem ? 'Add card' : 'Edit card'),
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button
                        mode="contained"
                        icon="close"
                        style={{ backgroundColor: theme.colors.error }}
                        onPress={() => {
                            if (hasChanges) {
                                setShowChanges(true);
                            } else {
                                router.back();
                            }
                        }}
                        disabled={loading}
                    >
                        {t(isNewItem ? 'Cancel' : 'Back')}
                    </Button>

                    <Button
                        mode="contained"
                        icon="check"
                        onPress={() => saveItem()}
                        disabled={loading}
                        loading={loading}
                    >
                        {t('Save')}
                    </Button>
                </View>
            )
        });
    }, [navigation, t, saveItem, theme.colors.error, loading, router, hasChanges, isNewItem]);

    return (
        <View style={{ backgroundColor: theme.colors.background, height: '100%', paddingBottom: 65, paddingHorizontal: 20, paddingTop: 20, gap: 20, flexDirection: 'row' }}>
            <View style={{ flex: 2 }}>
                <TextInput
                    value={editName}
                    label={t('Card name')}
                    onChangeText={val => {
                        setHasChanges(true);
                        setEditName(val);
                    }}
                />
            </View>
            <View style={{ flex: 1 }}>
                <Surface>
                    <View style={{ width: '100%', aspectRatio: '1/1', justifyContent: 'center', alignItems: 'center', borderRadius: theme.roundness, position: 'relative' }} ref={cameraWrap}>
                        {showCamera ? (
                            <CameraView
                                style={{ width: '100%', height: '100%', borderRadius: theme.roundness }}
                                facing={"back"}
                                autofocus="on"
                                ratio="1:1"
                                enableTorch={cameraFlashEnabled}
                                onCameraReady={() => setCameraReady(true)}
                                onMountError={(e) => console.log('Camera error', e)}
                                animateShutter={false}
                                ref={camera}
                            />
                        ) : (item.image && !removeImage) || tempImage ? (
                            <Image
                                source={{ uri: tempImage || item.image }}
                                style={{ width: '100%', height: '100%', borderRadius: theme.roundness }}
                            />
                        ) : (
                            <Text>{t('No image')}</Text>
                        )}

                        {showCamera ? (
                            <View style={{ position: 'absolute', width: '100%', bottom: 0, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <IconButton
                                    icon="close"
                                    iconColor={theme.colors.error}
                                    onPress={() => {
                                        setShowCamera(false);
                                        setCameraFlashEnabled(false);
                                    }}
                                />
                                <IconButton
                                    icon="camera-iris"
                                    iconColor={theme.colors.primary}
                                    size={50}
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
                        ) : (
                            <View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    bottom: 0,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 10,
                                    backgroundColor: theme.colors.backdrop,
                                    paddingHorizontal: 10
                                }}
                            >
                                {!removeImage || tempImage ? (
                                    <IconButton
                                        icon={tempImage ? 'close' : 'trash-can-outline'}
                                        iconColor={theme.colors.error}
                                        onPress={() => {
                                            if (tempImage) {
                                                setTempImage('');
                                            } else {
                                                setRemoveImage(true);
                                            }
                                        }}

                                    />
                                ) : null}
                                <IconButton
                                    icon="camera"
                                    iconColor={theme.colors.primary}
                                    onPress={() => setShowCamera(true)}
                                />
                            </View>
                        )}
                    </View>
                </Surface>
            </View>
            <Portal>
                <Snackbar
                    visible={showDoneSnack}
                    onDismiss={() => setShowDoneSnack(false)}
                    action={{
                        label: t('Go back'),
                        onPress: () => {
                            router.back();
                        },
                    }}>
                    {t('Card saved')}
                </Snackbar>
            </Portal>
            <Portal>
                <Dialog visible={showChanges} onDismiss={() => setShowChanges(false)}>
                    <Dialog.Title>{t('Unsaved changes')}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{t('You have unsaved changes')}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => router.back()}>{t('Discard changes')}</Button>
                        <Button onPress={() => setShowChanges(false)}>{t('Return')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default EditItem;
