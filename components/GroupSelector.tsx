import { FC } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface Props {
    title: string
    color: string
    onPress: () => void
    active: boolean
}

const GroupSelector: FC<Props> = ({ title, color, onPress, active }) => {
    return (
        <TouchableOpacity
            style={[
                style.wrap,
                { backgroundColor: color },
            ]}
            onPress={onPress}
        >
            <Text 
                numberOfLines={1} 
                style={[
                    style.text,
                    active && style.active,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    wrap: {
        minWidth: 100,
        justifyContent: "center",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginHorizontal: 3,
        paddingHorizontal: 10
    },
    text: {
        fontSize: 16
    },
    active: {
        fontWeight: "bold"
    }
})

export default GroupSelector
