import LV from './languages/lv-LV.json'
import DE from './languages/de-DE.json'
import UK from './languages/uk-UA.json'

export enum LANG {
    LV = 'lv-LV',
    EN = 'en-US',
    DE = 'de-DE',
    UK = 'uk-UA',
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
    },
    [LANG.UK]: {
        title: 'Українська',
        translations: UK,
        value: LANG.UK,
    }
}