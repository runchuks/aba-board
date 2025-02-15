import STORAGE from "@/storage"
import { Item } from "@/types"
import { FC, useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { DraxView } from "react-native-drax"

interface Props {
    id: number
    item: Item | null
}

const ListEditItem: FC<Props> = ({ id, item }) => {
    // const [item, setItem] = useState<Item | null>(null)

    useEffect(() => {
        // STORAGE.getItem(id).then(val => {
        //     setItem(val)
        // })
    }, [id])

    if (!item) return null

    return (
        <View style={style.wrap}>
            <Text>{item.name}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginBottom: 5
    }
})

export default ListEditItem
