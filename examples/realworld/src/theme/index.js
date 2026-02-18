import {useIsDarkMode} from '@utils/hooks';
import {useSelector} from 'react-redux';
import {BlueTheme} from './blueTheme';
import {GreenTheme} from './greenTheme';
import {OrangeTheme} from './orangeTheme';
import {PinkTheme} from './pinkTheme';
import {YellowTheme} from './yellowTheme';

export const ThemeSupport = [
  OrangeTheme,
  PinkTheme,
  BlueTheme,
  GreenTheme,
  YellowTheme,
];

// Hook which returns colors and theme data
export const useTheme = () => {
  const isDarkMode = useIsDarkMode();
  // const forceDark = useSelector(state => state.application.force_dark);
  const reduxTheme = useSelector(state => state.application.theme);
  const selectedThemeObject = ThemeSupport.find(
    t => t.theme === reduxTheme?.name,
  );
  // if (forceDark || isDarkMode) {
  //   return {theme: theme.dark, colors: theme.dark.colors};
  // }
  if (isDarkMode) {
    return {
      theme: selectedThemeObject.dark,
      colors: selectedThemeObject.dark.colors,
    };
  }
  return {
    theme: selectedThemeObject.light,
    colors: selectedThemeObject.light.colors,
  };
};
