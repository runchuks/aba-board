import { useSelector } from "react-redux"
import * as Speech from 'expo-speech';
import { GlobalState } from "@/types";
import { DEFAULT_LANG } from "@/constants/global";

const speak = (text: string, lang = DEFAULT_LANG) => {
    Speech.isSpeakingAsync().then((speaking) => {
        if (!speaking) {
            console.log(`Trying to say: ${text} Lang: ${lang}`)
            Speech.speak(text, { language: lang });
        }
    })
}

export default speak
