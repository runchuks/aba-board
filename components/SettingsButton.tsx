import STYLES from "@/constants/styles";
import useTranslation from "@/localization";
import { Link, useNavigation, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native"

const SettingsButton = () => {
    const router = useRouter();
    const t = useTranslation();

    const onPress = () => {
        router.navigate('/settings');
    }
    
    return (
        <TouchableOpacity style={STYLES.button} onPress={onPress}>
            <Text>{t('Settings')}</Text>
        </TouchableOpacity>
    )
}

export default SettingsButton
