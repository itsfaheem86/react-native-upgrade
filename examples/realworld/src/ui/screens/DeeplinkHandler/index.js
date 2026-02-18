import {CommonStyles} from '@config/styles';
import {
  ComponentNames,
  DeeplinkParams,
  FlexAlignments,
  KeyboardShouldPersistTypes,
  RouteNames,
} from '@constants/strings';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import ScrollView from '@ui/components/ScrollView';
import {getNavigationScreenFromAuthState} from '@utils';
import {omit} from 'lodash';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const DeeplinkHandler = props => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const route = props?.route;
  const navigation = useNavigation();
  const params = route?.params;
  const auth = useSelector(state => state?.auth);
  console.log({auth, params, props});
  const [isValidDeeplink, setIsValidDeeplink] = useState(true);
  const ackComponents = auth.ackComponents || [];
  const canNavigateToInitialize = ackComponents?.includes(
    ComponentNames.AuthTokenProvider,
  );
  const screen = params?.screen;
  const authState = auth?.authState;
  const navigateToDeeplink = () => {
    navigation?.navigate(screen, omit(params, [DeeplinkParams.screen])); // Don't need to reset since user find no way to navigate back to home/other screens
  };
  useEffect(() => {
    if (params) {
      const isScreenExist = Object.values(RouteNames).includes(screen);
      if (isScreenExist) {
        setIsValidDeeplink(true);
        navigateToDeeplink();
      } else {
        setIsValidDeeplink(false);
      }
    }
  }, [params]);

  const onGoBack = () => {
    let navigationScreen = getNavigationScreenFromAuthState(
      authState,
      canNavigateToInitialize,
    );
    if (canNavigateToInitialize && !navigationScreen) {
      navigationScreen = RouteNames.Initialize;
    }
    // Dispatch un initialize will not trigger navigation change, since we are deeplink
    if (authState && navigationScreen) {
      navigation.reset({
        routes: [
          {
            name: navigationScreen,
          },
        ],
      });
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {
              color: isValidDeeplink ? colors.primary : colors.error,
              fontWeight: FontWeights.bold,
            },
          ]}>
          {isValidDeeplink ? t('Deeplink handler') : t('Broken deeplink')}
        </Text>
        <Text>
          {isValidDeeplink
            ? t('You are trying to access a deeplink of our application!')
            : t('Deeplink you are trying to access is broken or invalid!')}
        </Text>
      </View>
      <View style={[CommonStyles.fullFlex]}>
        {isValidDeeplink && (
          <Button
            onPress={navigateToDeeplink}
            style={[
              {
                backgroundColor: colors.primary,
                alignItems: FlexAlignments.center,
              },
              CommonStyles.normalPadding,
              CommonStyles.normalRadius,
              CommonStyles.bigMarginVertical,
            ]}>
            <Text style={[{color: colors.light}]}>{t('Open the link')}</Text>
          </Button>
        )}
        <Button
          onPress={onGoBack}
          style={[
            {
              alignItems: FlexAlignments.center,
              borderColor: CommonColors.gray,
            },
            CommonStyles.normalPadding,
            CommonStyles.normalRadius,
            CommonStyles.normalBorderWidth,
          ]}>
          <Text>{t('Go back')}</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default DeeplinkHandler;
