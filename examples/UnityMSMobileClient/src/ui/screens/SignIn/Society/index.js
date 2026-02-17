import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {CommonDelays, Paddings, ValidationNumbers} from '@constants/numbers';
import {
  AuthStates,
  CommonStrings,
  ErrorMessages,
  FlexAlignments,
  RouteNames,
  UserKeys,
  UserTypes,
  ValidationModes,
} from '@constants/strings';
import {useSignInSocietyQuery} from '@graphql/actions/auth/queries';
import useCustomApolloClient from '@graphql/apollo';
import {persistor} from '@graphql/cache';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  pushLoggedInUser,
  resetAckComponents,
  resetAuthToken,
  resetUserState,
  setAuthState,
  setUserToken,
} from '@redux/slices/authSlice';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import CheckBox from '@ui/components/CheckBox';
import NetworkButton from '@ui/components/NetworkButton';
import TextButton from '@ui/components/TextButton';
import YupTextInput from '@ui/components/YupTextInput';
import {
  getReferenceFromSchemaAndId,
  setAuthToken,
  setAuthTokenByReference,
  showDefaultToast,
} from '@utils';
import {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from './styles';

// Title and language check done for forms in this component: Check 1
const SocietySignIn = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const apolloClient = useCustomApolloClient();

  const {navigation, route} = props;
  const {params} = route;
  const disableRememberMe = params?.disableRememberMe;
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    [UserKeys.email]: yup
      .string()
      .trim()
      .email(t('Email must be valid'))
      .required(),
    [UserKeys.password]: yup
      .string()
      .min(ValidationNumbers.minimumPasswordLength),
  });
  const rememberMe = useRef(true);
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.onChange,
    defaultValues: {
      [UserKeys.email]: CommonStrings.empty,
      [UserKeys.password]: CommonStrings.empty,
    },
  });
  const [
    signInSocietyQuery,
    {loading: isSignInSocietyLoading, data: signInSocietyData},
  ] = useSignInSocietyQuery();

  const onSignInSociety = values => {
    console.log({component: SocietySignIn.name, onSignInSociety: values});
    signInSocietyQuery({variables: {signInSocietyDto: values}});
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const login = async signInSocietyData => {
      if (signInSocietyData) {
        try {
          setIsLoading(true);
          const response = signInSocietyData?.response;
          const token = response?.token;
          // This will let initialize component wait for AuthTokenProvider actions
          dispatch(resetAckComponents());
          if (rememberMe.current) {
            const userRef = getReferenceFromSchemaAndId(
              response?.type,
              response?._id,
            );
            await setAuthToken(token);
            await setAuthTokenByReference(userRef, token);
            dispatch(pushLoggedInUser({ref: userRef}));
            // While switching between token temporary token is not resetting
            dispatch(resetAuthToken()); // Don't move outside since AuthTokenProvider will redirect to auth fail if token not available
          } else {
            dispatch(setUserToken(token));
          }
          // Even though we are purging previous query related results will be exist in in memory cache
          // Which causing the initializer to not trigger network request and get the results from in memory cache
          // That causing forbidden/un authorization error
          await apolloClient?.clearStore();
          // Removing all the stored data
          await persistor.purge();
          // Switching between users bug, need to clean user default account.
          dispatch(resetUserState());
          setTimeout(() => {
            setIsLoading(false);
            dispatch(setAuthState(AuthStates.authUnInitialized));
            // Switching between users bug, need to clean user default account.
            dispatch(resetUserState());
          }, CommonDelays.waitRedux);
        } catch (e) {
          setIsLoading(false);
          console.log({component: SocietySignIn.name, e});
          showDefaultToast({message: e?.message || ErrorMessages.UnknownError});
        }
      }
    };
    login(signInSocietyData);
  }, [signInSocietyData, isSignInSocietyLoading]);
  return (
    <View style={[{padding: Paddings.big}]}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Society SignIn')}
        </Text>
        <Text>{t('SignIn and manage society and members information')}</Text>
      </View>
      <View style={[CommonStyles.bigMarginBottom]}>
        <YupTextInput
          containerStyle={[CommonStyles.bigMarginBottom]}
          control={control}
          name={UserKeys.email}
          placeholder={t('Email')}
          errors={errors}
        />
        <YupTextInput
          control={control}
          name={UserKeys.password}
          placeholder={t('Password')}
          secureTextEntry={true}
          errors={errors}
        />
      </View>
      <View
        style={[
          CommonStyles.bigMarginBottom,
          styles.rememberMeAndForgotPasswordContainer,
        ]}>
        {!disableRememberMe && (
          <CheckBox
            defaultValue={rememberMe.current}
            onToggle={isChecked => {
              rememberMe.current = isChecked;
            }}
            text={t('Remember me')}
          />
        )}
        <TextButton
          textStyle={[{color: colors.primary}]}
          text={'Forgot password?'}
          onPress={() => {
            navigation.navigate(RouteNames.ForgotPassword, {
              [UserKeys.userType]: UserTypes.Society,
              disableRememberMe,
            });
          }}
        />
      </View>
      <View style={[CommonStyles.bigMarginBottom]}>
        <NetworkButton
          style={[
            {
              backgroundColor: colors.primary,
              alignItems: FlexAlignments.center,
            },
            CommonStyles.bigPadding,
            CommonStyles.normalRadius,
          ]}
          disabled={!isValid || isSignInSocietyLoading || isLoading}
          loading={isSignInSocietyLoading || isLoading}
          onPress={handleSubmit(onSignInSociety)}>
          <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
            {t('SignIn')}
          </Text>
        </NetworkButton>
      </View>
      {/* Wait for v2 */}
      {/* <Text
        style={[
          {
            color: colors.primaryLight,
            fontWeight: FontWeights.medium,
            textAlign: TextAlignments.center,
          },
          CommonStyles.bigMarginBottom,
        ]}>
        {t('Or')}
      </Text>
      <Button
        style={[
          {
            alignItems: FlexAlignments.center,
            borderColor: CommonColors.gray,
          },
          CommonStyles.bigPadding,
          CommonStyles.normalRadius,
          CommonStyles.normalBorderWidth,
          CommonStyles.bigMarginBottom,
        ]}>
        <Text>{t('LogIn with Google')}</Text>
      </Button> */}

      <View
        style={[
          CommonStyles.bigMarginBottom,
          styles.doesNotHaveAccountContainer,
        ]}>
        <Text style={[CommonStyles.bigMarginRight]}>
          {t("Don't have account?")}
        </Text>
        <TextButton
          textStyle={[{fontWeight: FontWeights.medium, color: colors.primary}]}
          text={'SignUp'}
          onPress={() => {
            navigation.navigate(RouteNames.SignUp, {
              [UserKeys.userType]: UserTypes.Society,
            });
          }}
        />
      </View>
    </View>
  );
};

export default SocietySignIn;
