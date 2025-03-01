import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Modal, useTheme, Button } from "react-native-paper";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";

interface Props {
    id: number | null
    active: boolean
    currentColor: string | null
    onClose: () => void
}

const EditGroupColor: FC<Props> = ({ id, active, currentColor, onClose }) => {
    const theme = useTheme()
    const t = useTranslation()

    const [color, setColor] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setColor(currentColor || '');
        setLoading(false)
    }, [currentColor])

    const onSave = () => {
        if (id) {
            setLoading(true)
            STORAGE.updateGroupById(id, {
                color
            }).then(() => {
                onClose()
            })
        }

    }

    const onSelectColor = ({ hex }: { hex: string }) => {
        setColor(hex)
    };

    if (!active || !id || currentColor === null) return null

    return (
        <Modal
            visible={true}
            onDismiss={onClose}
            contentContainerStyle={{
                backgroundColor: theme.colors.background,
                width: 500,
                padding: 30,
                borderRadius: theme.roundness
            }}
            style={{
                alignItems: "center"
            }}
        >

            <ColorPicker style={{ width: '100%', maxHeight: '90%' }} value={currentColor} onComplete={onSelectColor}>
                <Preview />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <Panel1 style={{ marginVertical: 10, flex: 1 }} />
                    <HueSlider style={{ marginVertical: 10 }} vertical />
                </View>
            </ColorPicker>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 20,
                    marginTop: 10
                }}
            >
                <Button
                    mode="elevated"
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.onError
                    }}
                    onPress={onClose}
                    icon="close"
                >
                    {t('Cancel')}
                </Button>
                <Button
                    mode="contained"
                    style={{
                        flex: 1
                    }}
                    icon="check"
                    onPress={onSave}
                    loading={loading}
                >
                    {t('Save')}
                </Button>
            </View>
        </Modal>
    )
}

export default EditGroupColor
