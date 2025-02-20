import LV from './languages/lv-LV.json'
import DE from './languages/de-DE.json'

export enum LANG {
    LV = 'lv-LV',
    EN = 'en-US',
    DE = 'de-DE',
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