import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {ValidationNumbers} from '@constants/numbers';
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
  useResetMemberPasswordMutation,
  useResetSocietyPasswordMutation,
} from '@graphql/actions/auth/mutations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import ScrollView from '@ui/components/ScrollView';
import YupTextInput from '@ui/components/YupTextInput';
import {showDefaultToast} from '@utils';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

// Title and language check done for forms in this component: Check 1
const NewPassword = props => {
  const {navigation, route} = props;
  const {params} = route;

  const userType = params?.[UserKeys.userType];
  const disableRememberMe = params?.disableRememberMe;
  const email = params?.email;
  const token = params?.token;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const schema = yup.object().shape({
    [UserKeys.password]: yup
      .string()
      .min(ValidationNumbers.minimumPasswordLength),
  });
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [UserKeys.password]: CommonStrings.empty,
    },
  });

  const [
    resetMemberPasswordMutation,
    {loading: isResetMemberPasswordLoading, data: resetMemberPasswordData},
  ] = useResetMemberPasswordMutation();

  const [
    resetSocietyPasswordMutation,
    {loading: isResetSocietyPasswordLoading, data: resetSocietyPasswordData},
  ] = useResetSocietyPasswordMutation();

  const onUpdateNewPassword = values => {
    console.log({component: NewPassword.name, values, email, token, userType});
    if (userType === UserTypes.Society) {
      resetSocietyPasswordMutation({
        variables: {
          resetSocietyPasswordDto: {
            email,
            token,
            password: values?.password,
          },
        },
      });
    } else {
      resetMemberPasswordMutation({
        variables: {
          resetMemberPasswordDto: {
            email,
            token,
            password: values?.password,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (resetMemberPasswordData || resetSocietyPasswordData) {
      showDefaultToast({message: t('Password reset successfully!')});
      navigation.reset({
        routes: [
          {
            name: RouteNames.SignIn,
            params: {[UserKeys.userType]: userType, disableRememberMe},
          },
        ],
      });
    }
  }, [resetMemberPasswordData, resetSocietyPasswordData]);

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('New Password')}
        </Text>
        <Text>{t('Please enter your new password')}</Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={UserKeys.password}
        errors={errors}
        placeholder={t('Enter new password')}
        secureTextEntry
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
          isResetMemberPasswordLoading ||
          isResetSocietyPasswordLoading
        }
        loading={isResetMemberPasswordLoading || isResetSocietyPasswordLoading}
        onPress={handleSubmit(onUpdateNewPassword)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {t('Update password')}
        </Text>
      </NetworkButton>
    </ScrollView>
  );
};

export default NewPassword;
