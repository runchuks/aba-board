import { DEFAULT_LANG } from "@/localization/languages/constants";
import STORAGE from "@/storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lang: STORAGE.get('lang') || DEFAULT_LANG,
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLang: (state, action) => {
        STORAGE.set('lang', action.payload)
        state.lang = action.payload;
    },
  },
});

export const { setLang } = globalSlice.actions;
export default globalSlice.reducer;