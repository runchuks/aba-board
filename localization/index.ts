import { useCallback } from "react";
import { LANG, LANGS } from "./constants";
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_LANG } from "@/constants/global";

const useTranslation = () => {
    const lang = SecureStore.getItem('lang') || DEFAULT_LANG

    const t = useCallback((key: string): string => {
        if (lang === LANG.EN) return key
        if (LANGS[lang]) {
            if (LANGS[lang].translations[key]) {
                return LANGS[lang].translations[key]
            }
            return `${lang}:${key}:NO_TR`
        }
        return `${lang}:${key}:NO_LANG`
    }, [lang])

    return t
}

export default useTranslation
