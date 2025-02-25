import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { LANGS } from "@/localization/constants"
import { setLang, setMasterPin, setSpeechLang, setSpeechSpeed, setLocked } from "@/store/slices/global"
import { useCallback, useEffect, useState } from "react"
import { Button, Text, TextInput, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { useDispatch, useSelector } from "react-redux"
import * as Speech from 'expo-speech'
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import { useRouter } from "expo-router"

const timeout = 1000;
const maxAttempts = 5;

const GeneralSettings = () => {
    const t = useTranslation()
    const dispatch = useDispatch()
    const router = useRouter()
    const { lang, speechLang, speechSpeed, masterPin, locked } = useSelector((state) => state.global)
    const [availableLanguages, setAvailableLanguages] = useState<{ title: string, value: string }[]>([])
    const [innerSpeechSpeed, setInnerSpeechSpeed] = useState<number>(Number(speechSpeed))

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

                const isCurrentLang = languages.find(language => language.value === speechLang)

                if (!isCurrentLang) {
                    dispatch(setSpeechLang(languages[0].value))
                }
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
                <Text style={STYLES.inputLabel}>{t('Speech speed')}: {innerSpeechSpeed}</Text>
                <Slider
                    style={{ width: 400, height: 40, padding: 0, margin: 0 }}
                    minimumValue={0}
                    lowerLimit={10}
                    maximumValue={200}
                    upperLimit={220}
                    step={1}
                    value={speechSpeed}
                    onSlidingComplete={handleSpeechSpeedChange}
                    onValueChange={setInnerSpeechSpeed}
                />
            </View>
            <View style={STYLES.inputWrap}>
                <Text style={STYLES.inputLabel}>{t('PIN')}</Text>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Checkbox
                        value={locked}
                        onValueChange={val => dispatch(setLocked(val))}
                        color={locked ? '#4630EB' : undefined}
                        style={{ marginRight: 10 }}
                    />
                    <TextInput
                        style={[STYLES.input, { flex: 1 }]}
                        value={masterPin}
                        onChangeText={value => dispatch(setMasterPin(value))}
                        keyboardType="number-pad"
                        keyboardAppearance="light"
                    />
                </View>
            </View>
            {/* <Button
                title="DB"
                onPress={() => router.navigate('/dbadmin')}
            /> */}
        </View>
    )
}

export default GeneralSettings
