import STYLES from "@/constants/styles";
import { Group, Item } from "@/types";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Dimensions, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import EditItem from "./EditItem";
import * as FileSystem from 'expo-file-system';

interface Props {
    name: string
    id: number
    color: string
    lists: Item[][]
    listsMap: number[][]
    onRefresh: () => void
}


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
    const [newImage, setNewImage] = useState<string | null>(null)
    const [listToAddItemIndex, setListToAddItemIndex] = useState<number | null>(null)

    const [editItemId, setEditItemId] = useState<number | null>(null)

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

    const onEdit = (id: number, currentItem: Item) => {
        setEditItemId(id)
        setNewItemName(currentItem.name)
        setNewImage(currentItem.image)
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
                        if (newImage) {
                            const now = Date.now()
                            const path = FileSystem.documentDirectory + `image-${itemId}-${now}.jpg`
                            FileSystem.copyAsync({
                                from: newImage,
                                to: path
                            }).then(() => {
                                STORAGE.updateItemById(itemId, {
                                    image: path
                                }).then(() => {
                                    onRefresh()
                                    handleCloseAddModal()
                                })
                            })
                        } else {
                            onRefresh()
                            handleCloseAddModal()
                        }
                    })
                }
            })
        } else if (editItemId !== null) {

            if (newImage) {
                const now = Date.now()
                const path = FileSystem.documentDirectory + `image-${editItemId}-${now}.jpg`

                FileSystem.getInfoAsync(path).then(({ exists }) => {
                    if (exists) {
                        console.log('exists')
                        FileSystem.deleteAsync(path).then(() => {
                            console.log('deleted')
                            FileSystem.copyAsync({
                                from: newImage,
                                to: path
                            }).then(() => {
                                console.log('copied')
                                STORAGE.updateItemById(editItemId, {
                                    image: path,
                                    name: newItemName,
                                }).then(() => {
                                    onRefresh()
                                    handleCloseAddModal()
                                })
                            }).catch(err => {
                                console.log(err)
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        FileSystem.copyAsync({
                            from: newImage,
                            to: path
                        }).then(() => {
                            console.log('copied')
                            STORAGE.updateItemById(editItemId, {
                                name: newItemName,
                                image: path
                            }).then(() => {
                                onRefresh()
                                handleCloseAddModal()
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })

            } else {
                STORAGE.updateItemById(editItemId, {
                    name: newItemName,
                }).then(() => {
                    onRefresh()
                    handleCloseAddModal()
                })
            }


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

    const deleteItem = (data: number[], index: number, deletedId: number) => {
        const newLists = [...listsMap]
        newLists[index] = data;

        STORAGE.updateGroupById(id, {
            lists: JSON.stringify(newLists)
        }).then(() => {
            STORAGE.deleteItemById(deletedId).then(() => {
                onRefresh()
            })
        })
    }

    const deleteGroup = () => {
        Alert.alert(t('Delete group?'), '', [
            {
                text: t('Cancel'),
                onPress: () => { },
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
                    deleteItem={deleteItem}
                    onEdit={onEdit}
                />
            ))
        }
        return []
    }, [lists, listsMap])

    const handleCloseAddModal = () => {
        setShowAddModal(false)
        setListToAddItemIndex(null)
        setEditItemId(null)
        setNewImage(null)
        setNewItemName('')
    }

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
                    <View style={[style.centeredView]}>
                        <View style={style.colorPickerWrap}>
                            <ColorPicker style={{ width: '100%' }} value={color} onComplete={onSelectColor}>
                                <Preview />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                    <Panel1 style={{ marginVertical: 10, flex: 1 }} />
                                    <HueSlider style={{ marginVertical: 10 }} vertical />
                                </View>
                            </ColorPicker>
                            <Button title={t('Ok')} onPress={closeColorPickerModal} />
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showAddModal || editItemId !== null}
                    animationType='slide'
                    transparent
                    onRequestClose={() => {
                        setShowAddModal(false);
                    }}
                >
                    <View style={style.centeredView}>
                        <View style={style.innerModalWrap}>
                            <EditItem
                                itemName={newItemName}
                                itemImage={newImage}
                                onItemNameChange={setNewItemName}
                                onImageChange={setNewImage}
                                onSave={saveItem}
                                onClose={handleCloseAddModal}
                                onSpeakOut={speakOut}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={style.listsWrap}>
                {renderEditLists}
                {/* <TouchableOpacity style={style.addColumn}>
                    <AntDesign name="plus" size={24} color="grey" />
                </TouchableOpacity> */}
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
        flexDirection: "row",
        alignItems: "flex-start",
        flex: 1,
    }
})

export default GroupEdit
