import { FC } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useTheme } from "react-native-paper"

interface Props {
    title: string
    color: string
    onPress: () => void
    active: boolean
}

const GroupSelector: FC<Props> = ({ title, color, onPress, active }) => {
    const theme = useTheme()
    return (
        <TouchableOpacity
            style={[
                style.wrap,
                {
                    backgroundColor: color,
                    borderColor: theme.colors.primaryContainer,
                    borderBottomLeftRadius: theme.roundness,
                    borderBottomRightRadius: theme.roundness
                },
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
        marginHorizontal: 3,
        paddingHorizontal: 10,
        height: '90%',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    text: {
        fontSize: 16
    },
    active: {
        fontWeight: "bold"
    }
})

export default GroupSelector
