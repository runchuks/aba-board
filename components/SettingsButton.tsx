import useTranslation from "@/localization";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';

const SettingsButton = () => {
    const router = useRouter();

    const onPress = () => {
        router.navigate('/settings');
    }

    return (
        <TouchableOpacity onPressIn={onPress}>
            <AntDesign name="setting" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default SettingsButton
