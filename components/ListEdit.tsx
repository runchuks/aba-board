import { Item } from "@/types"
import { FC, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from "react-redux";
import ListEditItem from "./ListEditItem";

interface Props {
    list: Item[]
    listMap: number[]
    index: number
    groupId: number
    onAdd: (index: number) => void
    onOrderChange: (data: number[], index: number) => void
    deleteItem: (data: number[], index: number, deletedId: number) => void
    onEdit: (id: number, currentName: string) => void
}

const ListEdit: FC<Props> = ({
    list,
    listMap,
    index,
    groupId,
    onAdd,
    onOrderChange,
    deleteItem,
    onEdit,
}) => {
    const { lang } = useSelector(state => state.global)

    const [innerList, setInnerList] = useState<number[]>([])

    useEffect(() => {
        setInnerList(listMap)
    }, [listMap])

    const addItem = () => {
        onAdd(index)
    }

    const moveDown = (id: number) => {
        const currentIndex = listMap.indexOf(id)
        if (currentIndex < listMap.length - 1) {
            const newListMap = [...listMap]
            const temp = newListMap[currentIndex]
            newListMap[currentIndex] = newListMap[currentIndex + 1]
            newListMap[currentIndex + 1] = temp
            onOrderChange(newListMap, index)
        }
    }

    const moveUp = (id: number) => {
        const currentIndex = listMap.indexOf(id)
        if (currentIndex > 0) {
            const newListMap = [...listMap]
            const temp = newListMap[currentIndex]
            newListMap[currentIndex] = newListMap[currentIndex - 1]
            newListMap[currentIndex - 1] = temp
            onOrderChange(newListMap, index)
        }
    }

    const handleDeleteItem = (id: number) => {
        const newListMap = listMap.filter(item => item !== id)
        deleteItem(newListMap, index, id)
    }

    const editItem = (id: number) => {
        onEdit(id, list.find(({ id }) => id === id)?.name || '')
    }

    const renderItem = ({ item }: { item: number }) => {
        const currentIndex = listMap.indexOf(item)
        const isFirst = currentIndex === 0
        const isLast = currentIndex === listMap.length - 1

        return (
            <ListEditItem
                id={item}
                item={list.find(({ id }) => id === item) || null}
                moveDown={moveDown}
                moveUp={moveUp}
                deleteItem={handleDeleteItem}
                editItem={editItem}
                disableUp={isFirst}
                disableDown={isLast}
            />
        );
    };

    return (
        <View style={style.wrap}>
            <FlatList
                data={innerList}
                renderItem={renderItem}
                keyExtractor={item => item.toString()}
            />
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
    nameInputWrap: {
        flexDirection: "row"
    }
})

export default ListEdit
