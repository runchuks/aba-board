import useTranslation from "@/localization";
import { CameraView } from "expo-camera";
import { FC, useCallback, useRef, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import * as FileSystem from 'expo-file-system';

interface Props {
    groupId: number | null
    onDissmiss: () => void
}

enum STEP {
    PICTURE,
    NAME
}

const QuickAdd: FC<Props> = ({ groupId, onDissmiss }) => {
    const theme = useTheme()
    const t = useTranslation()

    const [step, setStep] = useState<STEP>(STEP.PICTURE)
    const [cameraFlashEnabled, setCameraFlashEnabled] = useState<boolean>(false)
    const [cameraReady, setCameraReady] = useState<boolean>(false)
    const [tempImage, setTempImage] = useState<string>('')
    const [tempName, setTempName] = useState<string>('')

    const camera = useRef<CameraView>(null)

    const takePicture = useCallback(() => {
        if (cameraReady) {
            camera.current?.takePictureAsync({ quality: 0.5, base64: true }).then((data) => {
                if (data?.uri) {
                    setTempImage(data.uri);
                    setCameraFlashEnabled(false);
                    setStep(STEP.NAME)
                }
            }).catch((e) => {
                console.log('Error taking picture', e);
            });
        }
    }, [cameraReady]);

    const addItem = useCallback(async () => {
        // let newPath = '';

        // if (tempImage) {
        //     const now = Date.now();
        //     newPath = FileSystem.documentDirectory + `image-${itemId}-${now}.jpg`;

        //     const { exists } = await FileSystem.getInfoAsync(item.image);
        //     if (exists) {
        //         await FileSystem.deleteAsync(item.image);
        //     }

        //     await FileSystem.copyAsync({
        //         from: tempImage,
        //         to: newPath
        //     });
        // }

        // TO-DO

        onDissmiss()
    }, [onDissmiss]);

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
                    <CameraView
                        style={{ width: '100%', height: '100%' }}
                        facing={"back"}
                        autofocus="on"
                        ratio="1:1"
                        enableTorch={cameraFlashEnabled}
                        onCameraReady={() => setCameraReady(true)}
                        onMountError={(e) => console.log('Camera error', e)}
                        animateShutter={false}
                        ref={camera}
                    />
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
                        <View
                            style={{
                                width: 50
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
