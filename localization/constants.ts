import LV from './languages/lv.json'
import DE from './languages/de.json'

export enum LANG {
    LV = 'lv',
    EN = 'en',
    DE = 'de',
}

export const LANGS = {
    [LANG.LV]: {
        title: 'Latviešu',
        translations: LV,
        value: LANG.LV,
    },
    [LANG.EN]: {
        title: 'English',
        translations: null,
        value: LANG.EN,
    },
    [LANG.DE]: {
        title: 'Deutsch',
        translations: DE,
        value: LANG.DE,
    }
}