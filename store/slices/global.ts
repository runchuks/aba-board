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
    locked: SecureStore.getItem('locked') !== null ? Boolean(Number(SecureStore.getItem('locked'))) : DEFAULT_LOCKED,
    lastDragged: null,
    voicesLoaded: SecureStore.getItem('voicesLoaded') !== null ? Boolean(Number(SecureStore.getItem('voicesLoaded'))) : true,
    editingGroup: null
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
    },
    setVoicesLoaded: (state, action: PayloadAction<boolean>) => {
      console.log('voices loaded', action)
      SecureStore.setItem('voicesLoaded', action.payload ? '1' : '0')
      state.voicesLoaded = action.payload
    },
    setLastDragged: (state, action: PayloadAction<number | null>) => {
      state.lastDragged = action.payload
    },
    setEditingGroup: (state, action: PayloadAction<number | null>) => {
      state.editingGroup = action.payload
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
  setLastDragged,
  setVoicesLoaded,
  setEditingGroup,
} = globalSlice.actions;
export default globalSlice.reducer;