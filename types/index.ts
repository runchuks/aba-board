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
}

export interface User {
    id: number
    name: string
    image: string
    added: number
    advanced: boolean
    archived: boolean
}

export interface AddUser {
    name: string
    image: string
    advanced: boolean
    archived: boolean
}

export interface Item {
    id: number
    name: string
    image: string
}

export interface Group {
    id: number
    name: string
    color: string
    lists: Array<Item[]>
}

export interface Board {
    id: number
    userId: number
    added: number
    advanced: boolean
    archived: boolean
    groups?: Group[]
}