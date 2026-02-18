import {Themes} from '@constants/strings';

export const GreenTheme = {
  theme: Themes.green,
  light: {
    dark: false,
    colors: {
      primary: '#4FA3A5',
      primaryDark: '#147476',
      primaryLight: '#82d5d6',
      accent: '#A6B7C6',
      background: '#FBFBFB',
      card: 'white',
      card2: '#E7E9EC',
      text: '#303030',
      border: '#A6B7C6',
      light: '#FFFFFF',
      error: '#E5383B',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#4FA3A5',
      primaryDark: '#147476',
      primaryLight: '#82d5d6',
      accent: '#A6B7C6',
      background: '#082032',
      card: '#334756',
      card2: '#1D2B39',
      text: '#e5e5e7',
      border: '#B9C0CA',
      light: '#FFFFFF',
      error: '#E5383B',
    },
  },
};
