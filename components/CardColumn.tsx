import STORAGE from "@/storage"
import { Item } from "@/types"
import { FC, useEffect, useMemo, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Card from "./Card"

interface Props {
    ids: number[]
    onDrag: (id: number, x: number, y: number) => void;
    onDrop: (id: number) => void
    display: boolean
    activeCards: number[]
}

const CardColumn: FC<Props> = ({ ids, onDrag, onDrop, display, activeCards }) => {
    const [items, setItems] = useState<Item[]>([])

    const getItems = () => {
        STORAGE.getItemsByIds(ids).then(values => {
            if (values) {
                const idMap = new Map(ids.map((id, index) => [id, index]));
                const newValues =  values.sort((a, b) => (idMap.get(a.id) ?? 0) - (idMap.get(b.id) ?? 0));
                setItems(newValues)
            }
            
        })
    }


    useEffect(() => {
        setItems([])
        getItems()
    }, [])

    const renderCards = useMemo<React.ReactNode>(() => {
        if (items) {
            return items.map((item, index) => (
                <Card
                    name={item.name}
                    id={item.id}
                    key={item.id}
                    onDrag={onDrag}
                    onDrop={onDrop}
                    display={activeCards.includes(item.id) ? true : display}
                    index={index}
                />
            ))
        }
        return []
    }, [JSON.stringify(items), display])

    return (
        <View style={style.wrap}>
            {renderCards}
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        height: '100%',
        padding: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: 'green'
    },
    cardWrap: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 5
    }
})

export default CardColumn
