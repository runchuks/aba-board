import { FC } from "react"
import { StyleSheet, Text, View } from "react-native"

interface Props {
    title: string
    color: string
}

const GroupSelector: FC<Props> = ({ title, color }) => {
    return (
        <View style={[style.wrap, { backgroundColor: color }]}>
            <Text>{title}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {

    }
})

export default GroupSelector
