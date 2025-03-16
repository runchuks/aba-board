import * as Speech from 'expo-speech';
import { DEFAULT_LANG, DEFAULT_SPPECH_SPEED } from "@/constants/global";
import * as SecureStore from 'expo-secure-store';
import { NativeBoundaryEvent } from 'expo-speech/build/Speech.types';

const speak = (text: string, lang = DEFAULT_LANG) => {

    const savedLang =  SecureStore.getItem('lang') || lang
    const savedVoice = SecureStore.getItem('speechLang') || lang
    const savedSpeed: number = Number(SecureStore.getItem('speechSpeed')) || DEFAULT_SPPECH_SPEED

    const onError = (error: Error) => {
        console.log('An error occurred:', error.message)
    }

    const onBoundary = (ev: NativeBoundaryEvent): void => {
        console.log(ev)
    }

    const onDone = () => {
        console.log('speech done')
    }

    const onMark = (ev: SpeechSynthesisEvent): void => {
        console.log(ev)
    }

    const onPause = (ev: SpeechSynthesisEvent): void => {
        console.log(ev)
    }

    const onResume = (ev: SpeechSynthesisEvent):void => {
        console.log(ev)
    }

    const onStart = ():void => {
        console.log('started')
    }

    const onStopped = (): void => {
        console.log('stopped')
    }

    console.log(`Trying to say: ${text} Lang: ${savedLang}, voice: ${savedVoice}, speed: ${savedSpeed / 100}`)
    Speech.isSpeakingAsync().then((speaking) => {
        if (speaking) {
            console.log('speaking')
            if (text) {
                Speech.stop().then(() => {
                    Speech.speak(text, {
                        language: savedLang,
                        rate: savedSpeed / 100,
                        voice: savedVoice,
                        pitch: 1,
                        onError,
                        onBoundary,
                        onDone,
                        onMark,
                        onPause,
                        onResume,
                        onStart,
                        onStopped,
                    }); 
                })
            }
        } else {
            console.log('new speech')
            if (text) {
                Speech.speak(text, {
                    language: savedLang,
                    rate: savedSpeed / 100,
                    voice: savedVoice,
                    pitch: 1,
                    onError,
                    onBoundary,
                    onDone,
                    onMark,
                    onPause,
                    onResume,
                    onStart,
                    onStopped,
                });
            }
            
        }
    })
}

export default speak
