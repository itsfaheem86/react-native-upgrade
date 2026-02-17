import {CompatibilityJSONVersions, Languages} from '@constants/strings';
import {resources} from '@langs';
import {showDefaultToast} from '@utils';
import i18n from 'i18next';
import {useEffect, useState} from 'react';
import {initReactI18next} from 'react-i18next';

// Initialize language and render child component
const LanguageProvider = ({children, loading}) => {
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    let isMounted = true;
    i18n
      .use(initReactI18next)
      .init({
        lng: Languages.english,
        fallbackLng: Languages.english,
        compatibilityJSON: CompatibilityJSONVersions.v3,
        interpolation: {
          escapeValue: false,
        },
        resources: resources,
      })
      .then(_ => {
        // Causing memory leak sometimes
        if (isMounted) setIsLanguageLoaded(true);
      })
      .catch(error => {
        console.log({component: LanguageProvider.name, error});
        showDefaultToast({message: error?.message});
      });
    return () => {
      isMounted = false;
      console.log({component: LanguageProvider.name, isMounted});
    };
  }, []);
  if (!isLanguageLoaded) return loading;
  return children;
};

export default LanguageProvider;
