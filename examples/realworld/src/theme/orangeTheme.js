import {Themes} from '@constants/strings';

export const OrangeTheme = {
  theme: Themes.orange,
  light: {
    dark: false,
    colors: {
      primary: '#F75435',
      primaryDark: '#bd1908',
      primaryLight: '#ff8761',
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
      primary: '#F75435',
      primaryDark: '#bd1908',
      primaryLight: '#ff8761',
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
