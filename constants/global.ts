import { LANG } from "@/localization/constants";

export const DEFAULT_PIN = '0000'
export const DEFAULT_LOCKED = false
export const DEFAULT_LANG = LANG.EN
export const DEFAULT_SPPECH_SPEED = 100
export const MAX_CARD_SIZE = 300
export const MIN_CARD_SIZE = 80
export const GROUP_HEIGHT = 40
export const DEFAULT_READ_LINE_HEIGHT = MIN_CARD_SIZE
export const VOICE_TIMEOUT = 1000
export const VOICE_MAX_ATTEMPTS = 5

export const THEMES = [
    {
        title: 'Light',
        value: 'light'
    },
    {
        title: 'Dark',
        value: 'dark'
    },
    {
        title: 'Amoled',
        value: 'amoled'
    },
    {
        title: 'Skyflare Dark',
        value: 'skyflare-dark'
    },
    {
        title: 'Skyflare Light',
        value: 'skyflare-light'
    },
    {
        title: 'Playful Dark',
        value: 'playful-dark'
    },
    {
        title: 'Playful Light',
        value: 'playful-light'
    }
]
