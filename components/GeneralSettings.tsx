import STYLES from "@/constants/styles"
import useTranslation from "@/localization"
import { LANGS } from "@/localization/constants"
import { setLang, setMasterPin, setSpeechLang, setSpeechSpeed, setLocked } from "@/store/slices/global"
import { useCallback, useEffect, useState } from "react"
import { Button, Text, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { useDispatch, useSelector } from "react-redux"
import * as Speech from 'expo-speech'
import Slider from '@react-native-community/slider';
import { useRouter } from "expo-router"
import { Modal, Portal, TextInput, Checkbox } from 'react-native-paper';

const timeout = 1000;
const maxAttempts = 5;

const GeneralSettings = () => {
    const t = useTranslation()
    const dispatch = useDispatch()
    const router = useRouter()
    const { lang, speechLang, speechSpeed, masterPin, locked } = useSelector((state) => state.global)
    const [availableLanguages, setAvailableLanguages] = useState<{ title: string, value: string }[]>([])
    const [innerSpeechSpeed, setInnerSpeechSpeed] = useState<number>(Number(speechSpeed))

    const [pinLocked, setPinLocked] = useState(locked)
    const [showLanguageModal, setShowLanguageModal] = useState(false)

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

    useEffect(() => {
        dispatch(setLocked(pinLocked))
    }, [pinLocked])

    const handleSpeechSpeedChange = (value: number) => {
        dispatch(setSpeechSpeed(value))
    }

    const hideLanguageModal = () => {
        setShowLanguageModal(false)
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
                <TextInput
                    value={LANGS[lang].title}
                    readOnly
                    right={<TextInput.Icon icon="chevron-down" onPress={() => setShowLanguageModal(true)} />}
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

            </View>
            <View style={STYLES.inputWrap}>
                <Text style={STYLES.inputLabel}>{t('PIN')}</Text>
                <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Checkbox
                        status={pinLocked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setPinLocked(!pinLocked);
                        }}
                    />
                    <TextInput
                        style={{ flex: 1 }}
                        value={masterPin}
                        onChangeText={value => dispatch(setMasterPin(value))}
                        keyboardType="number-pad"
                        keyboardAppearance="light"
                        right={<TextInput.Icon icon="lock-outline" />}
                    />
                </View>
            </View>
            {/* <Button
                title="DB"
                onPress={() => router.navigate('/dbadmin')}
            /> */}

            <Portal>
                <Modal
                    visible={showLanguageModal}
                    onDismiss={hideLanguageModal}
                    contentContainerStyle={containerStyle}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text>Example Modal.  Click outside this area to dismiss.</Text>
                </Modal>
            </Portal>
        </View>
    )
}

const containerStyle = { backgroundColor: 'white', padding: 20, width: 400 };

export default GeneralSettings
