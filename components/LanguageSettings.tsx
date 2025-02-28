import { VOICE_MAX_ATTEMPTS, VOICE_TIMEOUT } from "@/constants/global";
import useTranslation from "@/localization";
import { LANG, LANGS } from "@/localization/constants";
import { RootState } from "@/store";
import { setLang, setSpeechLang, setVoicesLoaded } from "@/store/slices/global";
import { Language } from "@/types";
import * as Speech from 'expo-speech'
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Divider, HelperText, List, RadioButton, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const LanguageSettings: FC = () => {
    const { lang, speechLang } = useSelector((state: RootState) => state.global)
    const dispatch = useDispatch()
    const t = useTranslation()

    const [allVoices, setAllVoices] = useState<{ title: string, value: string, name: string }[]>([])
    const [voicesLoading, setVoicesLoading] = useState<boolean>(true)

    const handleLangChange = (val: LANG) => {
        dispatch(setLang(val))
        if (!allVoices.length) {
            getVoices(0)
        }
        const newSpeechLang = allVoices.filter(voice => voice.name === val)[0]
        dispatch(setSpeechLang(newSpeechLang?.value || val))
    }

    const handleSpeechLangChange = (val: string) => {
        dispatch(setSpeechLang(val))
    }

    const getVoices = useCallback((time: number) => {
        setVoicesLoading(true)
        Speech.getAvailableVoicesAsync().then(voices => {
            if (voices.length) {
                const languages = voices
                    .map(voice => ({
                        title: `${voice.quality} - ${voice.name}`,
                        value: voice.identifier,
                        name: voice.language
                    }))
                setAllVoices(languages)
                setVoicesLoading(false)
                dispatch(setVoicesLoaded(true))
            } else {
                if (time < VOICE_MAX_ATTEMPTS) {
                    setTimeout(() => getVoices(time + 1), VOICE_TIMEOUT)
                } else {
                    setAllVoices([])
                    setVoicesLoading(false)
                    dispatch(setVoicesLoaded(false))
                }
            }

        })
    }, [])

    useEffect(() => {
        getVoices(0)
    }, [])


    const LanguageRow = (item: { item: Language, index: number }) => {
        const { item: language } = item
        const thisLangVoices = allVoices.filter(voice => voice.name === language.value)

        const voiceItems = thisLangVoices.map(voice => (
            <List.Item
                title={voice.title}
                onPress={() => handleSpeechLangChange(voice.value)}
                right={() => (
                    <RadioButton
                        value={voice.value}
                        status={speechLang === voice.value ? 'checked' : 'unchecked'}
                        onPress={() => handleSpeechLangChange(voice.value)}
                    />
                )}
                key={voice.value}
            />
        ))

        return (
            <View>
                <List.Accordion
                    title={language.title}
                    onPress={() => handleLangChange(language.value)}
                    expanded={lang === language.value}
                >
                    {voiceItems.length ? voiceItems : (
                        <List.Item
                            title={voicesLoading ? '' : () => (
                                <View>
                                    <Text>{t('No voices loaded')}</Text>
                                    <HelperText type="error">
                                        {t('Speak function will not work until voices are not loaded')}
                                    </HelperText>
                                </View>

                            )}
                            right={() => (
                                <View>
                                    <Button
                                        onPress={() => getVoices(0)}
                                        icon="reload"
                                        mode="elevated"
                                        loading={voicesLoading}
                                        disabled={voicesLoading}
                                    >
                                        <Text>{voicesLoading ? t('Loading voices') : t('Try again')}</Text>
                                    </Button>
                                </View>
                            )}
                        />
                    )}
                </List.Accordion>
                <Divider />
            </View>

        )
    }

    return (
        <View style={style.wrap}>
            <FlatList
                keyExtractor={(item) => item.value}
                renderItem={(item) => <LanguageRow {...item} />}
                data={Object.values(LANGS)}
            />
        </View>
    )
}

const style = StyleSheet.create({
    wrap: {
        width: '100%',
        height: '100%',
    }
})

export default LanguageSettings
