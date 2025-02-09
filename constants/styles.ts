import { StyleSheet } from "react-native";

const STYLES = StyleSheet.create({
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        textTransform: "uppercase",
        backgroundColor: "rgba(2,2,2,.5)"
    },
    settingsHeader: {
        fontSize: 21,
        marginTop: 20,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderColor: "#b0b0b0",
        paddingBottom: 4,
        marginBottom: 10
    },
    inputWrap: {
        marginTop: 10
    },
    inputLabel: {
        marginLeft: 10,
        marginBottom: 3
    },
    input: {
        borderWidth: 1,
        borderColor: '#a1a1a1',
        borderRadius: 5,
        paddingHorizontal: 20
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#a1a1a1',
        borderRadius: 5,
        paddingHorizontal: 20,
        height: 45
    }
})

export default STYLES
