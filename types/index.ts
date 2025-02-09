import { LANG } from "@/localization/constants"

export interface Kid {
    id: number
    name: string
    added: number
}

export interface GlobalState {
    loading: boolean
    lang: LANG
    masterPin: string
    kids: Kid[]
}