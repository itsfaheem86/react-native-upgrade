import {ApolloProvider} from '@apollo/client';
import useCustomApolloClient from '@graphql/apollo';
import AuthGuard from '@guards/AuthGuard';
import AnalyticProvider from '@providers/AnalyticProvider';
import LanguageProvider from '@providers/LanguageProvider';
import NetworkStatusProvider from '@providers/NetworkStatusProvider';
import NotificationProvider from '@providers/NotificationProvider';
import {NavigationContainer} from '@react-navigation/native';
import {useTheme} from '@theme';
import MainLoading from '@ui/components/MainLoading';
import OfflinePopup from '@ui/components/OfflinePopup';
import MainStack from '@ui/navigations/MainStack';

import {DEEPLINK_URI_ONE, DEEPLINK_URI_TWO} from '@constants/urls';
import AuthTokenProvider from '@providers/AuthTokenProvider';
import CacheProvider from '@providers/CacheProvider';
import LastSeenProvider from '@providers/LastSeenProvider';
import analytics from '@react-native-firebase/analytics';
import {useRef} from 'react';
import {StatusBar} from 'react-native';
import {ModalPortal} from 'react-native-modals';
import {Provider as PaperProvider} from 'react-native-paper';
import {RootSiblingParent} from 'react-native-root-siblings';

const UnityMSApp = () => {
  const {theme, colors} = useTheme();
  // We can set it inside redux maybe later
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const apolloClient = useCustomApolloClient();

  const onNavigationStateChange = async () => {
    try {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = navigationRef.current.getCurrentRoute().name;
      if (previousRouteName !== currentRouteName) {
        await analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
        console.log({
          component: UnityMSApp.name,
          previousRouteName,
          currentRouteName,
        });
      }
      routeNameRef.current = currentRouteName;
    } catch (e) {
      console.log({component: UnityMSApp.name, e});
    }
  };

  // Let's use default config for now
  // const linkingConfig = {
  //   screens: {},
  // };

  const deepLinking = {
    prefixes: [DEEPLINK_URI_ONE, DEEPLINK_URI_TWO],
    // config: linkingConfig,
  };

  return (
    // In order to make toast work after react-native 0.62
    <RootSiblingParent>
      <LanguageProvider loading={<MainLoading from={UnityMSApp.name} />}>
        <NavigationContainer
          theme={{...theme, fonts: {}}}
          ref={navigationRef}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          onStateChange={onNavigationStateChange}
          linking={deepLinking}
          fallback={<MainLoading />}
          navigationInChildEnabled>
          <ApolloProvider client={apolloClient}>
            <NetworkStatusProvider>
              <CacheProvider>
                <AuthTokenProvider>
                  <AuthGuard navigationRef={navigationRef}>
                    <AnalyticProvider>
                      <NotificationProvider>
                        <LastSeenProvider>
                          <PaperProvider>
                            <StatusBar backgroundColor={colors.primaryDark} />
                            <OfflinePopup />
                            <MainStack />
                          </PaperProvider>
                        </LastSeenProvider>
                      </NotificationProvider>
                    </AnalyticProvider>
                  </AuthGuard>
                </AuthTokenProvider>
              </CacheProvider>
            </NetworkStatusProvider>
            {/*Make Dialog Box Work */}
            <ModalPortal />
          </ApolloProvider>
        </NavigationContainer>
      </LanguageProvider>
    </RootSiblingParent>
  );
};

export default UnityMSApp;
