import useTranslation from "@/localization";
import STORAGE from "@/storage";
import { FC, useEffect, useState } from "react";
import { View } from "react-native";
import { Modal, Text, TextInput, useTheme, Button } from "react-native-paper";

interface Props {
    id: number | null
    active: boolean
    currentName: string | null
    onClose: () => void
}

const EditGroupName: FC<Props> = ({ id, active, currentName, onClose }) => {
    const theme = useTheme()
    const t = useTranslation()

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setName(currentName || '');
        setLoading(false)
    }, [currentName])

    const onSave = () => {
        if (id) {
            setLoading(true)
            STORAGE.updateGroupById(id, {
                name
            }).then(() => {
                onClose()
            })
        }

    }

    if (!active || !id || currentName === null) return null

    return (
        <Modal
            visible={true}
            onDismiss={onClose}
            contentContainerStyle={{
                backgroundColor: theme.colors.background,
                width: 300,
                padding: 30,
                borderRadius: theme.roundness
            }}
            style={{
                alignItems: "center"
            }}
        >

            <TextInput
                label={t('Group name')}
                value={name}
                onChangeText={setName}
            />
            <View
                style={{
                    flexDirection: 'row',
                    gap: 20,
                    marginTop: 10
                }}
            >
                <Button
                    mode="contained"
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.error
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

export default EditGroupName
