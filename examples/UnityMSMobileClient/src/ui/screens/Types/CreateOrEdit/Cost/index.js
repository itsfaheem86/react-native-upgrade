import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {
  CommonStrings,
  FlexAlignments,
  KeyboardShouldPersistTypes,
  TypeKeys,
  ValidationModes,
} from '@constants/strings';
import {
  useCreateSocietyCostTypeMutation,
  useUpdateSocietyCostTypeMutation,
} from '@graphql/actions/society/mutations';
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
const CreateOrEditCostType = props => {
  const {navigation, route} = props;
  const {params} = route;
  const type = params?.type;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const schema = yup.object().shape({
    [TypeKeys.name]: yup.string().required(),
  });
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [TypeKeys.name]: type?.name || CommonStrings.empty,
    },
  });

  const [
    createSocietyCostTypeMutation,
    {loading: isCreateSocietyCostTypeLoading, data: createSocietyCostTypeData},
  ] = useCreateSocietyCostTypeMutation();

  const [
    updateSocietyCostTypeMutation,
    {loading: isUpdateSocietyCostTypeLoading, data: updateSocietyCostTypeData},
  ] = useUpdateSocietyCostTypeMutation();

  const onCreateOrEditType = values => {
    if (type) {
      updateSocietyCostTypeMutation({
        variables: {
          updateSocietyCostTypeDto: {
            typeId: type?._id,
            ...values,
          },
        },
      });
    } else {
      createSocietyCostTypeMutation({
        variables: {
          createSocietyCostTypeDto: values,
        },
      });
    }
  };

  useEffect(() => {
    if (createSocietyCostTypeData || updateSocietyCostTypeData) {
      navigation.goBack();
    }
  }, [createSocietyCostTypeData, updateSocietyCostTypeData]);

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Enter cost type fields')}
        </Text>
        <Text>
          {t(
            'Please make sure to fill all required fields before adding cost type',
          )}
        </Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={TypeKeys.name}
        errors={errors}
        placeholder={t('Cost type name')}
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
          isCreateSocietyCostTypeLoading ||
          isUpdateSocietyCostTypeLoading
        }
        loading={
          isCreateSocietyCostTypeLoading || isUpdateSocietyCostTypeLoading
        }
        onPress={handleSubmit(onCreateOrEditType)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {type ? t('Update') : t('Create')}
        </Text>
      </NetworkButton>
    </ScrollView>
  );
};

export default CreateOrEditCostType;
