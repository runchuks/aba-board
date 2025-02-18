import STYLES from "@/constants/styles";
import { Group, Item } from "@/types";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import STORAGE from "@/storage";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import useTranslation from "@/localization";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from "react-redux";
import speak from "@/speak";
import ListEdit from "./ListEdit";
import { DraxProvider } from "react-native-drax";
import { useRouter } from "expo-router";

interface Props {
    name: string
    id: number
    color: string
    lists: Item[][]
    listsMap: number[][]
    onRefresh: () => void
}

const GroupEdit: FC<Props> = ({
    onRefresh,
    lists,
    listsMap,
    id,
    color,
    name,
}) => {
    const t = useTranslation()
    const router = useRouter()

    const { lang } = useSelector(state => state.global)

    const [groupName, setGroupName] = useState<string>(name)
    const [groupColor, setGroupColor] = useState<string>(color)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showAddModal, setShowAddModal] = useState<boolean>(false)


    const [newItemName, setNewItemName] = useState<string>('')
    const [listToAddItemIndex, setListToAddItemIndex] = useState<number | null>(null)

    const nameEditRef = useRef<TextInput>(null)

    const save = () => {
        console.log('saving...')
        STORAGE.updateGroupById(id, {
            name: groupName,
            color: groupColor,
        }).then(() => {
            Alert.alert(t('Group saved'))
        })
    }

    const onSelectColor = ({ hex }: { hex: string }) => {
        setGroupColor(hex)
    };

    const closeColorPickerModal = () => {
        setShowModal(false);
    }

    const onAdd = (index: number) => {
        setShowAddModal(true)
        setListToAddItemIndex(index)
    }

    const onEdit = (id: number) => {
        
    }

    const saveItem = () => {
        if (listToAddItemIndex !== null) {

            STORAGE.addItem(newItemName, lang).then(itemId => {
                if (itemId) {
                    const newLists = [...listsMap]
                    newLists[listToAddItemIndex].push(itemId)

                    STORAGE.updateGroupById(id, {
                        lists: JSON.stringify(newLists)
                    }).then(() => {
                        
                        onRefresh()
                        setShowAddModal(false)
                        setListToAddItemIndex(null);
                    })
                }
            })
        }
        
    }

    const speakOut = () => {
        speak(newItemName, lang)
    }

    const onOrderChange = (data: number[], index: number) => {
        const newLists = [...listsMap]
        newLists[index] = data;

        STORAGE.updateGroupById(id, {
            lists: JSON.stringify(newLists)
        }).then(() => {
            onRefresh()
        })
    }

    const deleteGroup = () => {
        Alert.alert(t('Delete group?'), '',[
            {
                text: t('Cancel'),
                onPress: () => {},
            },
            {
                text: t('Delete'),
                onPress: async () => {
                    STORAGE.deleteGroupById(id).then(() => {
                        onRefresh()
                        router.back()
                    })
                },
                style: "destructive"
            },
        ])
        
    }

    const renderEditLists = useMemo<React.ReactNode[]>(() => {
        if (lists) {
            return lists.map((list, i) => (
                <ListEdit
                    list={list}
                    listMap={listsMap[i]}
                    groupId={id}
                    index={i}
                    key={i}
                    onAdd={onAdd}
                    onOrderChange={onOrderChange}
                />
            ))
        }
        return []
    }, [lists, listsMap])

    return (
        <View style={style.wrap}>
            <View style={style.groupWrap}>
                <View style={{ flex: 1 }}>
                    <View style={style.textEditWrap}>
                        <AntDesign name="edit" size={16} color="grey" />
                        <TextInput
                            value={groupName}
                            onChangeText={setGroupName}
                            ref={nameEditRef}
                            style={style.groupInput}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <View style={[style.colorPicker, { backgroundColor: groupColor }]}>
                        <Ionicons name="color-palette-outline" size={15} color="black" />
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={style.editBtnWrap}>
                        <TouchableOpacity onPress={deleteGroup} style={style.groupBtn}>
                            <Feather name="trash-2" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={save} style={style.groupBtn}>
                            <AntDesign name="check" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
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

            <Modal
                visible={showAddModal}
                animationType='slide'
                transparent
                onRequestClose={() => {
                    setShowAddModal(false);
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
            <View style={style.listsWrap}>
                {renderEditLists}
                <TouchableOpacity style={style.addColumn}>
                    <AntDesign name="plus" size={24} color="grey" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        marginBottom: 10,
        height: '100%'
    },
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
        paddingVertical: 15,
        flex: 1
    },
    colorPicker: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(200,200,200,.6)"
    },
    colorPickerWrap: {
        borderWidth: 1,
        width: 500,
        justifyContent: "center",
        alignItems: "stretch",
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBtnWrap: {
        flexDirection: "row",
        gap: 3
    },
    textEditWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginHorizontal: 20
    },
    editPencil: {
        backgroundColor: "rgba(150,150,150,.4)",
        borderRadius: 5
    },
    addColumn: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 5,
        width: 50
    },
    listsWrap: {
        flexDirection: "row",
        gap: 5,
        flex: 1
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
    nameInputWrap: {
        flexDirection: "row"
    }
})

export default GroupEdit
