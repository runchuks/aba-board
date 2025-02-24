import * as Speech from 'expo-speech';
import { DEFAULT_LANG, DEFAULT_SPPECH_SPEED } from "@/constants/global";
import * as SecureStore from 'expo-secure-store';

const speak = (text: string, lang = DEFAULT_LANG) => {

    const savedLang =  SecureStore.getItem('lang') || lang
    const savedVoice = SecureStore.getItem('speechLang') || lang
    const savedSpeed: number = Number(SecureStore.getItem('speechSpeed')) || DEFAULT_SPPECH_SPEED

    const onError = (error: Error) => {
        console.log('An error occurred:', error.message)
    }

    console.log(`Trying to say: ${text} Lang: ${savedLang}, voice: ${savedVoice}, speed: ${savedSpeed / 100}`)
    Speech.isSpeakingAsync().then((speaking) => {
        if (speaking) {
            Speech.stop().then(() => {
                Speech.speak(text, {
                    language: savedLang,
                    rate: savedSpeed / 100,
                    voice: savedVoice,
                    pitch: 1,
                    onError
                }); 
            })
        } else {
            Speech.speak(text, {
                language: savedLang,
                rate: savedSpeed / 100,
                voice: savedVoice,
                pitch: 1,
                onError
            });
        }
    })
}

export default speak
