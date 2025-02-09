import useTranslation from "@/localization";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native"
import EvilIcons from '@expo/vector-icons/EvilIcons';

const SettingsButton = () => {
    const router = useRouter();
    const t = useTranslation();

    const onPress = () => {
        router.navigate('/settings');
    }
    
    return (
        <TouchableOpacity onPressIn={onPress}>
            <EvilIcons name="gear" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default SettingsButton
