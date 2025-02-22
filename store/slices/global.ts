import { DEFAULT_LANG, DEFAULT_PIN, DEFAULT_SPPECH_SPEED } from "@/constants/global";
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
    speechSpeed: SecureStore.getItem('speechSpeed') || DEFAULT_SPPECH_SPEED,
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
    }
  },
});

export const { setLang, setItems, setSpeechLang, setSpeechSpeed } = globalSlice.actions;
export default globalSlice.reducer;