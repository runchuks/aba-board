import { DEFAULT_LANG, DEFAULT_PIN } from "@/constants/global";
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
    }
  },
});

export const { setLang, setItems, setSpeechLang } = globalSlice.actions;
export default globalSlice.reducer;