import LV from '../languages/lv.json'

export enum LANG {
    LV = 'lv',
    EN = 'en'
}

export const DEFAULT_LANG = LANG.LV

export const LANGS = {
    [LANG.LV]: {
        title: 'Latviešu',
        translations: LV,
    }
}