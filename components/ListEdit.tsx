import { Item } from "@/types"
import { FC, forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import STYLES from "@/constants/styles";
import useTranslation from "@/localization";
import speak from "@/speak";
import { useSelector } from "react-redux";
import STORAGE from "@/storage";
import ListEditItem from "./ListEditItem";
import { DraxProvider, DraxView } from "react-native-drax";
import { NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";

interface Props {
    list: Item[]
    listMap: number[]
    index: number
    groupId: number
    onAdd: (index: number) => void
    onOrderChange: (data: number[], index: number) => void
}

const ListEdit: FC<Props> = ({
    list,
    listMap,
    index,
    groupId,
    onAdd,
    onOrderChange,
}) => {
    const { lang } = useSelector(state => state.global)
    const t = useTranslation()

    const [newItemName, setNewItemName] = useState<string>('')
    
    const [innerList, setInnerList] = useState<number[]>([])

    useEffect(() => {
        setInnerList(listMap)
    }, [])


    const addItem = () => {
        onAdd(index)
    }

    const saveItem = () => {
        STORAGE.addItem(newItemName, lang).then(itemId => {
            if (itemId) {
                console.log({ itemId })
                onAdd(itemId, index)
                setNewItemName('')
                setShowModal(false)
            }
        })
    }

    const changeOrder = (data: number[]) => {
        setInnerList(data);
        onOrderChange(data, index)
    }

    const speakOut = () => {
        speak(newItemName, lang)
    }

    const renderItem = ({ item, drag, isActive }: RenderItemParams<number>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                >
                    <ListEditItem id={item} item={list.find(({ id }) => id === item) || null}/>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <View style={style.wrap}>
            <NestableScrollContainer>
                <NestableDraggableFlatList
                    data={innerList}
                    renderItem={renderItem}
                    keyExtractor={item => item.toString()}
                    onDragEnd={({ data }) => changeOrder(data)}
                />
            </NestableScrollContainer>
            <TouchableOpacity style={style.addItem} onPress={addItem}>
                <AntDesign name="plus" size={24} color="grey" />
            </TouchableOpacity>

        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    addItem: {
        borderWidth: 2,
        borderColor: 'grey',
        alignItems: "center",
        justifyContent: "center",
    },
    innerModalWrap: {
        // borderWidth: 1,
        // width: 500,
        // justifyContent: "center",
        // alignItems: "stretch",
        // borderRadius: 20,
        // backgroundColor: '#fff',
        // padding: 20,
        // gap: 5
    },
    centeredView: {
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    nameInputWrap: {
        flexDirection: "row"
    }
})

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    draxBox: { width: 100, height: 100, margin: 20, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' },
    draggable: { width: 100, height: 100, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center' },
    text: { color: 'white', textAlign: 'center' },
  });

export default ListEdit
