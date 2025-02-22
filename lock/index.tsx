import { useSelector } from "react-redux";
import LockScreen from "./LockScreen";
import { useCallback, useEffect, useState } from "react";
import useTranslation from "@/localization";
import { Alert } from "react-native";

const useLock = () => {
    const { masterPin, locked } = useSelector((state) => state.global)

    const t = useTranslation();

    const [unlocked, setUnlocked] = useState<boolean>(false);
    const [pin, setPin] = useState<string>('');

    useEffect(() => {
        if (!locked) {
            setUnlocked(true);
        }
    }, [locked])

    const handleUnlock = () => {
        if (pin === masterPin) {
            setUnlocked(true);
        } else {
            Alert.alert(t('Wrong PIN'));
            setPin('');
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
                    maxLenght={masterPin.length}
                />
            ),
        };
    }

    return { unlocked: true };
}

export default useLock
