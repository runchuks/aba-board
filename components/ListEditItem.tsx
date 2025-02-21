import STORAGE from "@/storage"
import { Item } from "@/types"
import { FC, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Props {
    id: number
    item: Item | null,
    moveUp: (id: number) => void,
    moveDown: (id: number) => void,
    deleteItem: (id: number) => void,
    editItem: (id: number) => void,
    disableUp: boolean
    disableDown: boolean
}

const ListEditItem: FC<Props> = ({ id, item, moveUp, moveDown, deleteItem, editItem, disableUp, disableDown }) => {
    useEffect(() => {
    }, [id])

    if (!item) return null

    return (
        <View style={style.item}>
            <Text numberOfLines={1} style={{ maxWidth: '40%' }}>{item.name}</Text>
            <View style={style.controls}>
                <TouchableOpacity onPress={() => moveUp(id)} disabled={disableUp}>
                    <AntDesign name="up" size={24} color={disableUp ? "grey" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveDown(id)} disabled={disableDown}>
                    <AntDesign name="down" size={24} color={disableDown ? "grey" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editItem(id)}>
                    <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(id)}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    controls: {
        flexDirection: "row",
        gap: 10,
    }
})

export default ListEditItem
