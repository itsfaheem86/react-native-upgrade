import {Themes} from '@constants/strings';

export const BlueTheme = {
  theme: Themes.blue,
  light: {
    dark: false,
    colors: {
      primary: '#5DA9C1', // Primary color of the application
      primaryDark: '#3A758C', // Dark version of primary
      primaryLight: '#90DBF4', // Lighter version of primary
      accent: '#A6B7C6', // Eg. Check box pass color
      background: '#FBFBFB', // Overall background
      card: 'white', // Primary card color
      card2: '#E7E9EC', // Secondary card color
      text: '#303030', // Primary text color
      light: '#FFFFFF', // Lighter color to stand out in dark background
      border: '#A6B7C6', // Border color
      error: '#E5383B', // Error color
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: '#5CB9D1',
      primaryDark: '#5DA9C1',
      primaryLight: '#C6E8FF',
      accent: '#A6B7C6',
      background: '#082032',
      card: '#334756',
      card2: '#1D2B39',
      text: '#E5E5E7',
      light: '#FDFDFD',
      border: '#B9C0CA',
      error: '#E5383B',
    },
  },
};
