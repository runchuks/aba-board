import useTranslation from "@/localization";
import useLock from "@/lock";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native"

const EditBoard = () => {
    const { unlocked, LockScreen } = useLock();
    const { boardId } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const t = useTranslation()

    useEffect(() => {
        navigation.setOptions({ title: t('Edit board') });
    }, [boardId, navigation])

    if (!unlocked) return LockScreen;

    return (
        <Text>Edit board {boardId}</Text>
    )
}

export default EditBoard
