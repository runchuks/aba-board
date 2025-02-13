import { Item } from "@/types"
import { FC, useMemo, useState } from "react"
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import STYLES from "@/constants/styles";
import useTranslation from "@/localization";
import speak from "@/speak";
import { useSelector } from "react-redux";
import STORAGE from "@/storage";

interface Props {
    list: number[]
    index: number
    groupId: number
    onAdd: (id: number, index: number) => void
}

const ListEdit: FC<Props> = ({ list, index, groupId, onAdd }) => {
    const { lang } = useSelector(state => state.global)
    const t = useTranslation()
    const [showModal, setShowModal] = useState<boolean>(false)

    const [newItemName, setNewItemName] = useState<string>('')

    const addItem = () => {
        setShowModal(true)
    }

    const saveItem = () => {
        STORAGE.addItem(newItemName, lang).then(itemId => {
            if (itemId) {
                console.log({ itemId })
                onAdd(itemId, index)
            }
        })
    }

    const speakOut = () => {
        speak(newItemName, lang)
    }

    const renderItems = useMemo<React.ReactNode[]>(() => {
        if (list) {
            return list.map(itemId => <Text>{itemId}</Text>)
        }
        return []
    }, [list])

    return (
        <View style={style.wrap}>
            {renderItems}
            <TouchableOpacity style={style.addItem} onPress={addItem}>
                <AntDesign name="plus" size={24} color="grey" />
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType='slide'
                transparent
                onRequestClose={() => {
                    setShowModal(false);
                }}
            >
                <View style={style.centeredView}>
                    <View style={style.innerModalWrap}>
                        <View style={style.nameInputWrap}>
                            <View style={[STYLES.inputWrap, { flex: 1 }]}>
                                <Text style={STYLES.inputLabel}>{t('Item name')}</Text>
                                <TextInput
                                    value={newItemName}
                                    onChangeText={setNewItemName}
                                    style={STYLES.input}
                                />
                            </View>
                            <View style={{ justifyContent: "flex-end", paddingBottom: 5, marginLeft: 10 }}>
                                <TouchableOpacity onPress={speakOut} disabled={!newItemName}>
                                    <AntDesign name="sound" size={24} color={!newItemName ? 'grey' : 'black'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Button title={t('Save')} onPress={saveItem}/>
                        <Button title={t('Close')} color={'red'} onPress={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    addItem: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        justifyContent: "center",
    },
    innerModalWrap: {
        borderWidth: 1,
        width: 500,
        justifyContent: "center",
        alignItems: "stretch",
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 20,
        gap: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameInputWrap: {
        flexDirection: "row"
    }
})

export default ListEdit
