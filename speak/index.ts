import { useSelector } from "react-redux"
import * as Speech from 'expo-speech';
import { GlobalState } from "@/types";
import { DEFAULT_LANG } from "@/constants/global";
import * as SecureStore from 'expo-secure-store';

const speak = (text: string, lang = DEFAULT_LANG) => {

    const savedLang = SecureStore.getItem('speechLang') || lang

    console.log(`Trying to say: ${text} Lang: ${savedLang}`)
    Speech.isSpeakingAsync().then((speaking) => {
        if (speaking) {
            Speech.stop().then(() => {
                Speech.speak(text, { language: savedLang }); 
            })
        } else {
            Speech.speak(text, { language: savedLang });
        }
    })
}

export default speak
