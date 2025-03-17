import STORAGE from "@/storage"
import { Item } from "@/types"
import { FC, useEffect, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import Card from "./Card"

interface Props {
    ids: number[]
    onDrag: (id: number, x: number, y: number) => void;
    onDrop: (id: number) => void
    display: boolean
    activeCards: number[]
    cardSize: number
    last: boolean
    currentDraggedInside: number | null
}

const CardColumn: FC<Props> = ({ ids, onDrag, onDrop, display, activeCards, cardSize, last, currentDraggedInside }) => {
    const [items, setItems] = useState<Item[]>([])
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    const getItems = () => {
        STORAGE.getItemsByIds(ids).then(values => {
            if (values) {
                const idMap = new Map(ids.map((id, index) => [id, index]));
                const newValues = values.sort((a, b) => (idMap.get(a.id) ?? 0) - (idMap.get(b.id) ?? 0));
                setItems(newValues)
            }
        })
    }

    useEffect(() => {
        setItems([])
        getItems()
    }, [])

    const handleLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout
        setDimensions({ width, height })

        // const cardsPerRow = Math.floor(width / minCardSize)
        // const optimalCardSize = Math.min(maxCardSize, Math.floor(width / cardsPerRow))
        // setCardSize(optimalCardSize)
    }

    const renderCards = useMemo<React.ReactNode>(() => {
        if (items) {
            const cardsPerRow = Math.floor(dimensions.width / cardSize)
            return items.map((item, index) => {
                const row = Math.floor(index / cardsPerRow)
                const col = index % cardsPerRow
                const left = col * cardSize
                const top = row * cardSize

                return (
                    <Card
                        name={item.name}
                        id={item.id}
                        key={item.id}
                        onDrag={onDrag}
                        onDrop={onDrop}
                        display={activeCards.includes(item.id) ? true : display}
                        index={index}
                        left={left}
                        top={top}
                        cardSize={cardSize}
                        image={item.image}
                        active={activeCards.includes(item.id) || currentDraggedInside === item.id}
                    />
                )
            })
        }
        return []
    }, [items, dimensions.width, cardSize, onDrag, onDrop, activeCards, display])

    return (
        <View style={[style.wrap, last && style.last]} onLayout={handleLayout}>
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
        position: 'relative',
        borderRightWidth: 1,
        borderRightColor: 'rgba(99,99,99,.05)',
    },
    last: {
        borderRightWidth: 0
    },
    cardWrap: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 5
    }
})

export default CardColumn
