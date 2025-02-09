import { DEFAULT_LANG, DEFAULT_PIN } from "@/constants/global";
import { LANG } from "@/localization/constants";
import { GlobalState, Kid } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';

const initialState = {
    loading: false,
    lang: SecureStore.getItem('lang') || DEFAULT_LANG,
    masterPin: SecureStore.getItem('masterPin') || DEFAULT_PIN,
    kids: SecureStore.getItem('kids') ? JSON.parse(SecureStore.getItem('kids') as string) : [],
} as GlobalState

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<LANG>) => {
        SecureStore.setItem('lang', action.payload)
        state.lang = action.payload;
    },
    setKids: (state, action: PayloadAction<Kid[]>) => {
      SecureStore.setItem('kids', JSON.stringify(action.payload))
      state.kids = action.payload
    },
  },
});

export const { setLang, setKids } = globalSlice.actions;
export default globalSlice.reducer;