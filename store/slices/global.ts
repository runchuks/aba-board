import { DEFAULT_LANG, DEFAULT_LOCKED, DEFAULT_PIN, DEFAULT_SPPECH_SPEED } from "@/constants/global";
import { LANG } from "@/localization/constants";
import { GlobalState, Item } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    loading: false,
    lang: SecureStore.getItem('lang') || DEFAULT_LANG,
    masterPin: SecureStore.getItem('masterPin') || DEFAULT_PIN,
    items: {},
    speechLang: SecureStore.getItem('speechLang') || DEFAULT_LANG,
    speechSpeed: Number(SecureStore.getItem('speechSpeed')) || DEFAULT_SPPECH_SPEED,
    locked: Boolean(Number(SecureStore.getItem('locked'))) || DEFAULT_LOCKED
} as GlobalState

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<LANG>) => {
        SecureStore.setItem('lang', action.payload)
        state.lang = action.payload;
    },
    setItems: (state, action: PayloadAction<Record<number, Item>>) => {
      state.items = action.payload
    },
    setSpeechLang: (state, action: PayloadAction<string>) => {
        SecureStore.setItem('speechLang', action.payload)
        state.speechLang = action.payload;
    },
    setSpeechSpeed: (state, action: PayloadAction<number>) => {
        SecureStore.setItem('speechSpeed', action.payload.toString())
        state.speechSpeed = action.payload;
    },
    setMasterPin: (state, action: PayloadAction<string>) => {
        SecureStore.setItem('masterPin', action.payload)
        state.masterPin = action.payload
    },
    setLocked: (state, action: PayloadAction<boolean>) => {
        SecureStore.setItem('locked', action.payload ? '1' : '0')
        state.locked = action.payload
    }
  },
});

export const {
  setLang,
  setItems,
  setSpeechLang,
  setSpeechSpeed,
  setMasterPin,
  setLocked,
} = globalSlice.actions;
export default globalSlice.reducer;