import STYLES from "@/constants/styles";
import { Group } from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { Button, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import STORAGE from "@/storage";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import useTranslation from "@/localization";
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    name: string
    id: number
    editMode: boolean
    color: string
    onEdit: (id: number | null) => void
}

const GroupEdit: FC<Props> = ({
    onEdit,
    editMode,
    id,
    color,
    name,
}) => {
    const t = useTranslation()

    const [groupName, setGroupName] = useState<string>(name)
    const [groupColor, setGroupColor] = useState<string>(color)
    const [showModal, setShowModal] = useState<boolean>(false)

    const nameEditRef = useRef<TextInput>(null)

    const enableEditMode = () => {
        console.log(`Enable edit mode: ${id}`)
        onEdit(id)
    }

    const save = () => {
        console.log('saving...')
        STORAGE.updateGroupById(id, {
            name: groupName,
            color: groupColor,
        })
        onEdit(null)
    }

    const onSelectColor = ({ hex }: { hex: string }) => {
        setGroupColor(hex)
    };

    const closeColorPickerModal = () => {
        setShowModal(false);
        save();
    }

    useEffect(() => {
        if (editMode) {
            setTimeout(() => {
                if (nameEditRef.current) {
                    nameEditRef.current.focus()
                }
            }, 500)
        } else {
            Keyboard.dismiss()
        }

        console.log({id, editMode})
        
    }, [editMode])

    return (
        <View style={[style.groupWrap, !editMode && { backgroundColor: groupColor }]}>
            <View style={{ flex: 1 }}>
                {editMode ? (
                    <TextInput
                        value={groupName}
                        onChangeText={setGroupName}
                        ref={nameEditRef}
                        style={style.groupInput}
                    />
                ) : <Text style={style.groupName}>{groupName}</Text>}
            </View>
            {editMode ? (
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View style={[style.colorPicker, { backgroundColor: groupColor }]}>
                        <Ionicons name="color-palette-outline" size={15} color="black" />
                    </View>
                </TouchableOpacity>
            ) : null}
            <View>
                {editMode ? (
                    <TouchableOpacity onPress={save} style={style.groupBtn}>
                        <AntDesign name="check" size={24} color="black" />
                    </TouchableOpacity>
                ): (
                    <TouchableOpacity onPress={enableEditMode} style={style.groupBtn}>
                        <MaterialIcons name="drive-file-rename-outline" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <Modal visible={showModal} animationType='slide' transparent>
                <View style={style.centeredView}>
                    <View style={style.colorPickerWrap}>
                        <ColorPicker style={{ width: '100%' }} value={color} onComplete={onSelectColor}>
                            <Preview/>
                            <Panel1 style={{ marginVertical: 10}} />
                            <HueSlider style={{ marginVertical: 10}} />
                            <Swatches style={{ marginVertical: 10}} />
                        </ColorPicker>
                        <Button title={t('Ok')} onPress={closeColorPickerModal} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    groupWrap: {
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 10,
        marginBottom: 10
    },
    groupBtn: {
        padding: 10
    },
    groupName: {
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    groupInput: {
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    colorPicker: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5
    },
    colorPickerWrap: {
        borderWidth: 1,
        width: 500,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default GroupEdit
