import useTranslation from "@/localization";
import { RootState } from "@/store";
import { CameraView } from "expo-camera";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { View, Image } from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

const EditItem: FC = () => {
    const theme = useTheme()
    const { items } = useSelector((state: RootState) => state.global)
    const { itemId } = useLocalSearchParams<{ itemId: string }>();
    const navigation = useNavigation()
    const router = useRouter()
    const t = useTranslation()

    const [cameraFlashEnabled, setCameraFlashEnabled] = useState<boolean>(false)
    const [cameraReady, setCameraReady] = useState<boolean>(false)
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [tempImage, setTempImage] = useState<string>('')

    const camera = useRef<CameraView>(null)
    const cameraWrap = useRef(null)

    const { name, image } = items[parseInt(itemId, 10)];

    const takePicture = useCallback(() => {
        if (cameraReady) {
            camera.current?.takePictureAsync({ quality: 0.5, base64: true }).then((data) => {
                if (data?.uri) {
                    setTempImage(data.uri)
                    setShowCamera(false)
                    setCameraFlashEnabled(false)
                }
            }).catch((e) => {
                console.log('Error taking picture', e)
            })
        }
    }, [cameraReady])

    useEffect(() => {
        navigation.setOptions({
            title: t('Edit item'),
            headerRight: () => (
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10
                    }}
                >
                    <Button
                        mode="contained"
                        icon="close"
                        style={{
                            backgroundColor: theme.colors.error
                        }}
                        onPress={() => {
                            router.back()
                        }}
                    >
                        {t('Cancel')}
                    </Button>

                    <Button
                        mode="contained"
                        icon="check"
                    >
                        {t('Save')}
                    </Button>
                </View>

            )
        });
    }, [navigation, t])

    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                height: '100%',
                paddingBottom: 65,
                paddingHorizontal: 20,
                paddingTop: 20,
                gap: 20,
                flexDirection: 'row'
            }}
        >
            <View
                style={{
                    flex: 2
                }}
            >
                <TextInput
                    value={name}
                    label={t('Item name')}
                />
            </View>
            <View
                style={{
                    flex: 1
                }}
            >
                <View
                    style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: theme.roundness,
                        position: 'relative'
                    }}
                    ref={cameraWrap}
                >
                    {showCamera ? (
                        <CameraView
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: theme.roundness
                            }}
                            facing={"back"}
                            autofocus="on"
                            ratio="1:1"
                            enableTorch={cameraFlashEnabled}
                            onCameraReady={() => setCameraReady(true)}
                            onMountError={(e) => console.log('Camera error', e)}
                            animateShutter={false}
                            ref={camera}
                        />
                    ) : image ? (
                        <Image
                            source={{ uri: tempImage || image }}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: theme.roundness
                            }}
                        />
                    ) : (
                        <Text>{t('No image')}</Text>
                    )
                    }

                    {showCamera ? (
                        <View
                            style={{
                                position: 'absolute',
                                width: '100%',
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row'
                            }}
                        >
                            <IconButton
                                icon="close"
                                iconColor={theme.colors.error}
                                onPress={() => {
                                    setShowCamera(false)
                                    setCameraFlashEnabled(false)
                                }}
                            />
                            <IconButton
                                icon="camera-iris"
                                iconColor={theme.colors.primary}
                                size={50}
                                onPress={() => {
                                    takePicture()
                                }}
                            />
                            <IconButton
                                icon={cameraFlashEnabled ? 'flash' : 'flash-off'}
                                iconColor={theme.colors.secondary}
                                onPress={() => {
                                    setCameraFlashEnabled(!cameraFlashEnabled)
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
                            <IconButton
                                icon="trash-can-outline"
                                iconColor={theme.colors.error}
                                onPress={() => {
                                    if (tempImage) {
                                        setTempImage('')
                                        setShowCamera(true)
                                    }
                                }}
                            />
                            {tempImage ? (
                                <IconButton
                                    icon="check"
                                    iconColor={theme.colors.primary}
                                    onPress={() => { }}
                                />
                            ) : (
                                <IconButton
                                    icon="camera"
                                    iconColor={theme.colors.primary}
                                    onPress={() => setShowCamera(true)}
                                />
                            )}

                        </View>
                    )}

                </View>
                {/* <CameraView
                    style={{ width: '100%', height: '100%' }}
                    facing={"back"}
                    autofocus="on"
                    ratio="1:1"
                    enableTorch={cameraFlashEnabled}
                    onCameraReady={() => setCameraReady(true)}
                    onMountError={(e) => console.log('Camera error', e)}
                    animateShutter={false}
                    ref={camera}
                /> */}
            </View>
        </View>
    )
}

export default EditItem
