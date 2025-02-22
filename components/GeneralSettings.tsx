import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { LANGS } from "@/localization/constants"
import { setLang, setSpeechLang, setSpeechSpeed } from "@/store/slices/global"
import { useCallback, useEffect, useState } from "react"
import { Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { useDispatch, useSelector } from "react-redux"
import * as Speech from 'expo-speech'
import Slider from '@react-native-community/slider';

const timeout = 1000;
const maxAttempts = 5;

const GeneralSettings = () => {
    const t = useTranslation()
    const dispatch = useDispatch()
    const { lang, speechLang, speechSpeed } = useSelector((state) => state.global)
    const [availableLanguages, setAvailableLanguages] = useState<{ title: string, value: string }[]>([])
    const [innerSpeechSpeed, setInnerSpeechSpeed] = useState<number>(speechSpeed)

    const getVoices = useCallback((time: number) => {
        console.log('Getting voices: ', time)
        Speech.getAvailableVoicesAsync().then(voices => {
            if (voices.length) {
                const languages = voices
                    .map(voice => ({
                        title: `${voice.quality} | ${voice.name} | ${voice.language} | ${voice.identifier}`,
                        value: voice.identifier,
                        name: voice.language
                    }))
                    .filter(language => language.name === lang)
                setAvailableLanguages(languages)
            } else {
                if (time < maxAttempts) {
                    setTimeout(() => getVoices(time + 1), timeout)
                } else {
                    setAvailableLanguages([])
                }
            }

        })
    }, [lang])

    useEffect(() => {
        getVoices(0)
    }, [getVoices])

    const handleSpeechSpeedChange = (value: number) => {
        dispatch(setSpeechSpeed(value))
    }

    const speechDropdownDisabled = availableLanguages.length === 0

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
            <View style={[STYLES.inputWrap, speechDropdownDisabled && STYLES.disabled]}>
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
                    disable={speechDropdownDisabled}
                />
            </View>
            <View style={STYLES.inputWrap}>
                <Text style={STYLES.inputLabel}>{t('Speech speed')}</Text>
                <Slider
                    style={{ width: 400, height: 40, padding: 0 }}
                    minimumValue={0}
                    lowerLimit={10}
                    maximumValue={200}
                    upperLimit={220}
                    step={1}
                    value={speechSpeed}
                    onSlidingComplete={handleSpeechSpeedChange}
                    onValueChange={setInnerSpeechSpeed}
                />
                <Text style={{}}>{innerSpeechSpeed}</Text>
            </View>
        </View>
    )
}

export default GeneralSettings
