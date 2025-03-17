import useTranslation from "@/localization";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Appbar } from "react-native-paper";

const SettingsButton = () => {
    const router = useRouter();

    const onPress = () => {
        router.navigate('/settings');
    }

    return (
        <Appbar.Action icon="cog-outline" onPress={onPress} />
    )
}

export default SettingsButton
