import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {Paddings, ValidationNumbers} from '@constants/numbers';
import {
  CommonStrings,
  FlexAlignments,
  RouteNames,
  UserKeys,
  UserTypes,
  ValidationModes,
} from '@constants/strings';
import {useSignUpSocietyMutation} from '@graphql/actions/auth/mutations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import TextButton from '@ui/components/TextButton';
import YupTextInput from '@ui/components/YupTextInput';
import {showDefaultToast} from '@utils';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import styles from './styles';

// Title and language check done for forms in this component: Check 1
const SocietySignUp = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {navigation, route} = props;
  const {params} = route;
  const disableRememberMe = params?.disableRememberMe;

  const schema = yup.object().shape({
    [UserKeys.email]: yup
      .string()
      .trim()
      .email(t('Email must be valid'))
      .required(),
    [UserKeys.name]: yup.string().min(ValidationNumbers.minimumNameLength),
    [UserKeys.password]: yup
      .string()
      .min(ValidationNumbers.minimumPasswordLength),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    defaultValues: {
      [UserKeys.email]: CommonStrings.empty,
      [UserKeys.name]: CommonStrings.empty,
      [UserKeys.password]: CommonStrings.empty,
    },
    resolver: yupResolver(schema),
    mode: ValidationModes.onChange,
  });

  const [
    signUpSocietyMutation,
    {loading: isSignUpSocietyLoading, data: signUpSocietyData},
  ] = useSignUpSocietyMutation();

  const onSignUpSociety = value => {
    signUpSocietyMutation({variables: {signUpSocietyDto: value}});
  };

  const goBackToLogin = () => {
    navigation.reset({
      routes: [
        {
          name: RouteNames.SignIn,
          params: {[UserKeys.userType]: UserTypes.Society, disableRememberMe},
        },
      ],
    });
  };

  useEffect(() => {
    if (signUpSocietyData?.response) {
      showDefaultToast({message: t('Society signed up successfully')});
      goBackToLogin();
    }
  }, [signUpSocietyData]);

  return (
    <View style={[{padding: Paddings.big}]}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Society SignUp')}
        </Text>
        <Text>{t('SignUp and manage society and members information')}</Text>
      </View>
      <View style={[CommonStyles.bigMarginBottom]}>
        <YupTextInput
          containerStyle={[CommonStyles.bigMarginBottom]}
          control={control}
          name={UserKeys.name}
          placeholder={t('Society name')}
          errors={errors}
        />
        <YupTextInput
          containerStyle={[CommonStyles.bigMarginBottom]}
          control={control}
          name={UserKeys.email}
          placeholder={t('Society email')}
          errors={errors}
        />
        <YupTextInput
          control={control}
          name={UserKeys.password}
          placeholder={t('Society password')}
          secureTextEntry={true}
          errors={errors}
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
          disabled={!isValid || isSignUpSocietyLoading}
          loading={isSignUpSocietyLoading}
          onPress={handleSubmit(onSignUpSociety)}>
          <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
            {t('SignUp')}
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
        <Text>{t('Continue with Google')}</Text>
      </Button> */}

      <View
        style={[
          CommonStyles.bigMarginBottom,
          styles.alreadyHaveAccountContainer,
        ]}>
        <Text style={[CommonStyles.bigMarginRight]}>
          {t('Already have an account?')}
        </Text>
        <TextButton
          textStyle={[{fontWeight: FontWeights.medium, color: colors.primary}]}
          text={'SignIn'}
          onPress={() => {
            navigation.reset({
              routes: [
                {
                  name: RouteNames.SignIn,
                  params: {[UserKeys.userType]: UserTypes.Society},
                },
              ],
            });
          }}
        />
      </View>
    </View>
  );
};

export default SocietySignUp;
