import Config from '@config/config';
import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {
  CommonStrings,
  FlexAlignments,
  GraphqlPaths,
  KeyboardShouldPersistTypes,
  UserKeys,
  ValidationModes,
} from '@constants/strings';
import {useGetMeQuery} from '@graphql/actions/auth/queries';
import {useUpdateMemberProfileMutation} from '@graphql/actions/member/mutations';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import NetworkScrollView from '@ui/components/NetworkScrollView';
import YupImagePicker from '@ui/components/YupImagePicker';
import YupTextInput from '@ui/components/YupTextInput';
import {bracket} from '@utils';
import {get} from 'lodash';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

// Title and language check done for forms in this component: Check 1
const EditMemberProfile = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [redirect, setRedirect] = useState(false);
  const [
    getMeQuery,
    {data: getMeData, loading: isGetMeLoading, refetch: refetchMe},
  ] = useGetMeQuery();
  useEffect(() => {
    getMeQuery();
  }, []);
  const me = get(getMeData, GraphqlPaths.data);

  const schema = yup.object().shape({
    [UserKeys.avatar]: yup.object().shape({
      uri: yup.string().required(t('Profile picture is required')),
    }),
    [UserKeys.name]: yup.string().required(),
  });

  const {
    control,
    watch,
    formState: {errors, isValid},
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
  });
  // Why: Since me is from network setting default directly not working
  useEffect(() => {
    if (me) {
      reset({
        [UserKeys.name]: me?.name,
        // For now avatar is string but in future we may change it
        [UserKeys.avatar]: {uri: me?.avatar},
      });
    }
  }, [me]);

  const [
    updateMemberProfileMutation,
    {loading: isUpdateMemberProfileLoading, data: updateMemberProfileData},
  ] = useUpdateMemberProfileMutation();

  const onUpdateMemberProfile = values => {
    setRedirect(true);
    const pPicKey = values?.avatar?.uri?.replace(
      Config.awsS3BucketCloudFrontUri,
      CommonStrings.empty,
    );
    console.log({component: EditMemberProfile.name, values, pPicKey});
    updateMemberProfileMutation({
      variables: {
        updateMemberProfileDto: {
          name: values?.name,
          // For now we only update the uri
          // Need to update pPicKey for now it's ok
          avatar: values?.avatar?.uri?.replace(
            Config.awsS3BucketCloudFrontUri,
            CommonStrings.empty,
          ),
        },
      },
    });
  };

  useEffect(() => {
    if (updateMemberProfileData && redirect) {
      navigation.goBack();
    }
  }, [updateMemberProfileData]);

  const avatar = watch(UserKeys.avatar);
  useEffect(() => {
    if (avatar?.uri && bracket(me?.avatar !== avatar?.uri)) {
      setRedirect(false);
      updateMemberProfileMutation({
        variables: {
          updateMemberProfileDto: {
            name: me?.name,
            avatar: avatar?.uri?.replace(
              Config.awsS3BucketCloudFrontUri,
              CommonStrings.empty,
            ),
          },
        },
      });
    }
  }, [avatar, me?._id]);

  return (
    <NetworkScrollView
      refreshing={isGetMeLoading}
      onRefresh={refetchMe}
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Update member profile')}
        </Text>
        <Text>
          {t('Please make sure to fill all required fields before update')}
        </Text>
      </View>
      <View
        style={[
          CommonStyles.bigMarginBottom,
          {alignItems: FlexAlignments.center},
        ]}>
        <YupImagePicker
          placeholder={t('Pick a profile picture')}
          control={control}
          name={UserKeys.avatar}
          nestedValidation
          errors={errors}
          upload
        />
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={UserKeys.name}
        errors={errors}
        placeholder={t('Name')}
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
        disabled={!isValid || isUpdateMemberProfileLoading}
        loading={isUpdateMemberProfileLoading}
        onPress={handleSubmit(onUpdateMemberProfile)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {t('Update')}
        </Text>
      </NetworkButton>
    </NetworkScrollView>
  );
};

export default EditMemberProfile;
