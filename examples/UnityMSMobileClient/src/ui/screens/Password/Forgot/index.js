import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {
  CommonStrings,
  FlexAlignments,
  KeyboardShouldPersistTypes,
  RouteNames,
  UserKeys,
  UserTypes,
  ValidationModes,
} from '@constants/strings';
import {
  useRequestMemberPasswordResetMutation,
  useRequestSocietyPasswordResetMutation,
} from '@graphql/actions/auth/mutations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import ScrollView from '@ui/components/ScrollView';
import YupTextInput from '@ui/components/YupTextInput';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

// Title and language check done for forms in this component: Check 1
const ForgotPassword = props => {
  const {navigation, route} = props;
  const {params} = route;
  const userType = params?.[UserKeys.userType];
  const disableRememberMe = params?.disableRememberMe;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const schema = yup.object().shape({
    [UserKeys.email]: yup
      .string()
      .trim()
      .email(t('Email must be valid'))
      .required(),
  });
  const {
    control,
    getValues,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [UserKeys.email]: CommonStrings.empty,
    },
  });

  const [
    requestMemberPasswordResetMutation,
    {
      loading: isRequestMemberPasswordResetLoading,
      data: requestMemberPasswordResetData,
    },
  ] = useRequestMemberPasswordResetMutation();

  const [
    requestSocietyPasswordResetMutation,
    {
      loading: isRequestSocietyPasswordResetLoading,
      data: requestSocietyPasswordResetData,
    },
  ] = useRequestSocietyPasswordResetMutation();

  const onRequestResetPassword = values => {
    if (userType === UserTypes.Society) {
      requestSocietyPasswordResetMutation({
        variables: {
          requestResetSocietyPasswordDto: {
            email: values?.email,
          },
        },
      });
    } else {
      requestMemberPasswordResetMutation({
        variables: {
          requestResetMemberPasswordDto: {
            email: values?.email,
          },
        },
      });
    }
  };

  useEffect(() => {
    const email = getValues(UserKeys.email);
    if (requestMemberPasswordResetData || requestSocietyPasswordResetData) {
      navigation.navigate(RouteNames.VerifyOTP, {
        [UserKeys.userType]: userType,
        email,
        disableRememberMe,
      });
    }
  }, [requestMemberPasswordResetData, requestSocietyPasswordResetData]);

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Password Reset')}
        </Text>
        <Text>{t('We will send a verification code to your email')}</Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={UserKeys.email}
        errors={errors}
        placeholder={t('Email')}
      />
      <NetworkButton
        style={[
          {
            backgroundColor: colors.primary,
            alignItems: FlexAlignments.center,
          },
          CommonStyles.bigPadding,
          CommonStyles.normalRadius,
        ]}
        disabled={
          !isValid ||
          isRequestMemberPasswordResetLoading ||
          isRequestSocietyPasswordResetLoading
        }
        loading={
          isRequestMemberPasswordResetLoading ||
          isRequestSocietyPasswordResetLoading
        }
        onPress={handleSubmit(onRequestResetPassword)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {t('Send code')}
        </Text>
      </NetworkButton>
    </ScrollView>
  );
};

export default ForgotPassword;
