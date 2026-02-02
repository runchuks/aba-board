import STYLES from '@/constants/styles';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FC, useCallback, useRef, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput, Button, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTranslation from '@/localization';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
    itemName: string
    itemImage: string | null
    onItemNameChange: (name: string) => void
    onImageChange: (image: string | null) => void
    onSave: () => void
    onClose: () => void
    onSpeakOut: () => void
}

const EditItem: FC<Props> = ({
    itemName,
    itemImage,
    onItemNameChange,
    onImageChange,
    onSave,
    onClose,
    onSpeakOut
}) => {

    const [permission, requestPermission] = useCameraPermissions();
    const t = useTranslation()

    const [cameraFlashEnabled, setCameraFlashEnabled] = useState<boolean>(false);
    const [cameraReady, setCameraReady] = useState<boolean>(false);

    const camera = useRef<CameraView>(null)

    const takePicture = useCallback(() => {
        if (itemImage) {
            onImageChange(null)
        } else {
            camera.current?.takePictureAsync({ quality: 0.5, base64: true }).then((data) => {
                if (data?.uri) {
                    onImageChange(data.uri)
                }
            }).catch((e) => {
                console.log('Error taking picture', e)
            })
        }

    }, [itemImage, onImageChange])

    return (
        <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
                {!permission?.granted ? (
                    <Button title={t('Request camera permission')} onPress={requestPermission} />
                ) : (

                    <View style={{ width: 150, height: 150, overflow: 'hidden', position: 'relative' }}>
                        {itemImage ? (
                            <Image
                                source={{ uri: itemImage }}
                                style={{ width: 150, height: 150 }}
                            />
                        ) : (
                            <CameraView
                                style={{ width: 150, height: 150 }}
                                facing={"back"}
                                autofocus="on"
                                ratio="1:1"
                                enableTorch={cameraFlashEnabled}
                                onCameraReady={() => setCameraReady(true)}
                                onMountError={(e) => console.log('Camera error', e)}
                                animateShutter={false}
                                ref={camera}
                            />
                        )}
                        {!itemImage && (
                            <View
                                style={{
                                    position: 'absolute',
                                    width: 150,
                                    height: 30,
                                    bottom: 0,
                                    left: 0,
                                    backgroundColor: 'rgba(0,0,0,.5)',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingHorizontal: 10
                                }}
                            >
                                <TouchableOpacity onPress={() => setCameraFlashEnabled(!cameraFlashEnabled)}>
                                    <Ionicons name={cameraFlashEnabled ? "flash" : "flash-off"} size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}
                        <View
                            style={{
                                position: 'absolute',
                                width: 50,
                                height: 50,
                                top: 50,
                                left: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,.5)',
                                borderRadius: 15
                            }}
                        >
                            <TouchableOpacity onPress={(takePicture)} disabled={!cameraReady && !itemImage}>
                                {itemImage ? (
                                    <MaterialCommunityIcons name="camera-retake-outline" size={30} color="white" />
                                ) : (
                                    <AntDesign name="camerao" size={30} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View style={{ flexDirection: "row", alignItems: "flex-start", flex: 1 }}>
                    <View style={[STYLES.inputWrap, { flex: 1 }]}>
                        <Text style={STYLES.inputLabel}>{t('Item name')}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <TextInput
                                value={itemName}
                                onChangeText={onItemNameChange}
                                style={[STYLES.input, { flex: 1 }]}
                            />
                            <TouchableOpacity onPress={onSpeakOut} disabled={!itemName}>
                                <AntDesign name="sound" size={24} color={!itemName ? 'grey' : 'black'} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>

            <Button title={t('Save')} onPress={onSave} />
            <Button title={t('Close')} color={'red'} onPress={onClose} />
        </View>
    )
}

export default EditItem
