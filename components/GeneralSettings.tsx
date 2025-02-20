import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { LANGS } from "@/localization/constants"
import { setLang, setSpeechLang } from "@/store/slices/global"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { useDispatch, useSelector } from "react-redux"
import * as Speech from 'expo-speech'
import { useNavigation } from "expo-router"

const GeneralSettings = () => {
    const t = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const { lang, speechLang } = useSelector((state) => state.global)
    const [availableLanguages, setAvailableLanguages] = useState<{ title: string, value: string }[]>([])

    useEffect(() => {
        Speech.getAvailableVoicesAsync().then(voices => {
            const languages = voices
                .map(voice => ({ title: `${voice.quality} | ${voice.name} | ${voice.language} | ${voice.identifier}`, value: voice.identifier, name: voice.language }))
                .filter(language => language.name === lang)
            setAvailableLanguages(languages)
        })
    }, [lang, navigation])

    return (
        <View>
            <Text style={STYLES.settingsHeader}>{t('General settings')}</Text>
            <View style={STYLES.inputWrap}>
                <Text style={STYLES.inputLabel}>{t('Language')}</Text>
                <Dropdown
                    labelField="title"
                    valueField="value"
                    data={Object.values(LANGS)}
                    value={lang}
                    onChange={item => {
                        dispatch(setLang(item.value))
                    }}
                    style={STYLES.dropdown}
                />
            </View>
            <View style={STYLES.inputWrap}>
                <Text style={STYLES.inputLabel}>{t('Speech Language')}</Text>
                <Dropdown
                    labelField="title"
                    valueField="value"
                    data={availableLanguages}
                    value={speechLang}
                    onChange={item => {
                        dispatch(setSpeechLang(item.value))
                    }}
                    style={STYLES.dropdown}
                />
            </View>
        </View>
    )
}

export default GeneralSettings
