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
    items: Record<number, Item>
    speechLang: string
    speechSpeed: number
    locked: boolean
    lastDragged: number | null
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
    color: string
    lang: LANG
}

export interface Group {
    id: number
    name: string
    color: string
    lists: number[][]
}

export interface FinalGroup {
    id: number
    name: string
    color: string
    lists: Item[][]
    listsMap: number[][]
}

export interface RawGroup {
    id: number
    name: string
    color: string
    lists: string
}

export interface Board {
    id: number
    userId: number
    added: number
    advanced: boolean
    archived: boolean
    groups?: Group[]
}