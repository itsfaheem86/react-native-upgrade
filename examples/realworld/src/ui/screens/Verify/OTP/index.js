import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {CommonDelays, ValidationNumbers} from '@constants/numbers';
import {
  fetchPolicyValues,
  FlexAlignments,
  GraphqlPaths,
  KeyboardShouldPersistTypes,
  RouteNames,
  UserKeys,
  UserTypes,
  ValidationModes,
} from '@constants/strings';
import {
  useVerifyMemberPasswordResetTokenQuery,
  useVerifySocietyPasswordResetTokenQuery,
} from '@graphql/actions/auth/queries';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import ScrollView from '@ui/components/ScrollView';
import YupVerificationCode from '@ui/components/YupVerificationCode';
import {showDefaultToast} from '@utils';
import {useEffect, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

// Title and language check done for forms in this component: Check 1
const VerifyOTP = props => {
  const {navigation, route} = props;
  const {params} = route;

  const userType = params?.[UserKeys.userType];
  const email = params?.email;
  const disableRememberMe = params?.disableRememberMe;

  // Can come from deeplink
  const token = params?.token;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const schema = yup.object().shape({
    [UserKeys.token]: yup
      .string()
      .min(ValidationNumbers.resetPasswordOTPLength),
  });

  const defaultValues = useMemo(
    () => ({
      [UserKeys.token]: token,
    }),
    [],
  );

  const {
    control,
    getValues,
    reset,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    if (token?.length) {
      setTimeout(() => {
        handleSubmit(onVerifyToken)();
      }, CommonDelays.small);
    }
  }, [token]);

  const [
    verifyMemberPasswordResetTokenQuery,
    {
      loading: isVerifyMemberPasswordResetTokenLoading,
      data: verifyMemberPasswordResetTokenData,
    },
  ] = useVerifyMemberPasswordResetTokenQuery();

  const [
    verifySocietyPasswordResetTokenQuery,
    {
      loading: isVerifySocietyPasswordResetTokenLoading,
      data: verifySocietyPasswordResetTokenData,
    },
  ] = useVerifySocietyPasswordResetTokenQuery();

  const onVerifyToken = values => {
    const token = values?.token;
    if (userType === UserTypes.Society) {
      verifySocietyPasswordResetTokenQuery({
        variables: {
          verifySocietyPasswordResetTokenDto: {
            token,
            email: email,
          },
        },
        fetchPolicy: fetchPolicyValues.networkOnly,
      });
    } else {
      verifyMemberPasswordResetTokenQuery({
        variables: {
          verifyMemberPasswordResetTokenDto: {
            token,
            email: email,
          },
        },
        fetchPolicy: fetchPolicyValues.networkOnly,
      });
    }
  };

  useEffect(() => {
    if (
      verifyMemberPasswordResetTokenData ||
      verifySocietyPasswordResetTokenData
    ) {
      if (
        verifyMemberPasswordResetTokenData?.[GraphqlPaths.data] ||
        verifySocietyPasswordResetTokenData?.[GraphqlPaths.data]
      ) {
        const token = getValues(UserKeys.token);
        navigation.navigate(RouteNames.NewPassword, {
          [UserKeys.userType]: userType,
          email,
          token,
          disableRememberMe,
        });
      } else {
        showDefaultToast({message: t('Invalid token!')});
      }
    }
  }, [
    verifyMemberPasswordResetTokenData,
    isVerifyMemberPasswordResetTokenLoading,
    verifySocietyPasswordResetTokenData,
    isVerifySocietyPasswordResetTokenLoading,
  ]);

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Verify token')}
        </Text>

        <Text>{t('Check your mail and enter the token we send')}</Text>
      </View>
      <YupVerificationCode
        control={control}
        name={UserKeys.token}
        errors={errors}
        containerStyle={[CommonStyles.bigMarginBottom]}
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
          isVerifyMemberPasswordResetTokenLoading ||
          isVerifySocietyPasswordResetTokenLoading
        }
        loading={
          isVerifyMemberPasswordResetTokenLoading ||
          isVerifySocietyPasswordResetTokenLoading
        }
        onPress={handleSubmit(onVerifyToken)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {t('Verify')}
        </Text>
      </NetworkButton>
    </ScrollView>
  );
};

export default VerifyOTP;
