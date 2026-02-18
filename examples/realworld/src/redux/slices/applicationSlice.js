import {ColorSchemes, Languages, SliceNames, Themes} from '@constants/strings';
import {createSlice} from '@reduxjs/toolkit';

export const applicationSlice = createSlice({
  name: SliceNames.application,
  initialState: {
    language: Languages.english,
    isConnected: true,
    theme: {
      name: Themes.blue,
      type: ColorSchemes.light,
    },
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action?.payload;
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action?.payload;
    },
    setTheme: (state, action) => {
      state.theme = {...state.theme, ...action?.payload};
    },
  },
});

export const {setLanguage, setConnectionStatus, setTheme} =
  applicationSlice.actions;

export default applicationSlice.reducer;
