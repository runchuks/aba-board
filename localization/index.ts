import { DEFAULT_LANG, LANG, LANGS } from "./languages/constants";

const useTranslation = () => {
    const t = (key: string, lang: LANG = DEFAULT_LANG): string => {
        if (LANGS[lang]) {
            if (LANGS[lang].translations[key]) {
                return LANGS[lang].translations[key]
            }
            return `${lang}:${key}`
        }
        return `${lang}:${key}`
    }
    return t
}

export default useTranslation
