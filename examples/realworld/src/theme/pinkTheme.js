import {Themes} from '@constants/strings';

export const PinkTheme = {
  theme: Themes.pink,
  light: {
    dark: false,
    colors: {
      primary: '#EA4B8B',
      primaryDark: '#b3005e',
      primaryLight: '#ff80bb',
      accent: '#A6B7C6',
      background: '#FBFBFB',
      card: 'white',
      card2: '#E7E9EC',
      text: '#303030',
      border: '#A6B7C6',
      light: '#FFFFFF',
      error: '#F5B841',
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#EA4B8B',
      primaryDark: '#b3005e',
      primaryLight: '#ff80bb',
      accent: '#A6B7C6',
      background: '#082032',
      card: '#334756',
      card2: '#1D2B39',
      text: '#e5e5e7',
      border: '#B9C0CA',
      light: '#FFFFFF',
      error: '#F5B841',
    },
  },
};
