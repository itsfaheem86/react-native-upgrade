import {Themes} from '@constants/strings';

export const YellowTheme = {
  theme: Themes.yellow,
  light: {
    dark: false,
    colors: {
      primary: '#FCB424',
      primaryDark: '#C48500',
      primaryLight: '#FFE65B',
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
      primary: '#FCB424',
      primaryDark: '#C48500',
      primaryLight: '#FFE65B',
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
