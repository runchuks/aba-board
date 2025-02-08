import STYLES from "@/constants/styles";
import useTranslation from "@/localization";
import { Text, TouchableHighlight, TouchableNativeFeedback, StyleSheet, TouchableOpacity } from "react-native";

const AddKidButton = () => {
    const t = useTranslation();

    const onPress = () => {
        console.log('add kid')
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[STYLES.button, style.wrap]}
        >
            <Text>{t('Add kid')}</Text>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    wrap: {
        marginRight: 10
    }
})

export default AddKidButton
