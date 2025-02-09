import { useSelector } from "react-redux";
import LockScreen from "./LockScreen";
import { useCallback, useState } from "react";
import useTranslation from "@/localization";
import { Alert } from "react-native";

const useLock = () => {
    const { masterPin } = useSelector((state) => state.global)

    const t = useTranslation();

    const [unlocked, setUnlocked] = useState<boolean>(false);
    const [pin, setPin] = useState<string>('');

    const handleUnlock = () => {
        if (pin === masterPin) {
            setUnlocked(true);
        } else {
            Alert.alert(t('Wrong PIN'));
        }
    };

    if (!unlocked) {
        return {
            unlocked: false,
            LockScreen: (
                <LockScreen
                    pin={pin}
                    setPin={setPin}
                    handleUnlock={handleUnlock}
                />
            ),
        };
    }

    return { unlocked: true };
}

export default useLock
