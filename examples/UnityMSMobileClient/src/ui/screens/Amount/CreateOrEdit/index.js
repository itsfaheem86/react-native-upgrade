import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {ValidationNumbers} from '@constants/numbers';
import {
  AmountHistoryKeys,
  CommonStrings,
  FlexAlignments,
  KeyboardShouldPersistTypes,
  KeyboardTypes,
  UserKeys,
  ValidationModes,
} from '@constants/strings';
import {
  useCreateMemberAmountHistoryMutation,
  useUpdateMemberAmountHistoryMutation,
} from '@graphql/actions/book/mutations';
import {GET_SOCIETY_ACCOUNTS_QUERY} from '@graphql/queries/society';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkButton from '@ui/components/NetworkButton';
import ScrollView from '@ui/components/ScrollView';
import TextButton from '@ui/components/TextButton';
import YupDateTimePicker from '@ui/components/YupDateTimePicker';
import YupTextInput from '@ui/components/YupTextInput';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const CreateOrEditPaidAmount = props => {
  const {navigation, route} = props;
  const {params} = route;
  const amountHistory = params?.amountHistory;
  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];

  const accountId = params?.accountId;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const schema = yup.object().shape({
    [AmountHistoryKeys.amount]: yup
      .number()
      .notOneOf(ValidationNumbers.notAllowedAmounts)
      .typeError(t('Amount should be valid'))
      .required(),
    [AmountHistoryKeys.description]: yup.string(),
    [AmountHistoryKeys.date]: yup.date().required(),
  });
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [AmountHistoryKeys.amount]:
        amountHistory?.amount?.toString() ?? CommonStrings.empty,
      [AmountHistoryKeys.description]:
        amountHistory?.description ?? CommonStrings.empty,
      [AmountHistoryKeys.date]: amountHistory?.date ?? moment(),
    },
  });
  const [addDescription, setAddDescription] = useState(
    !!amountHistory?.description,
  );
  const [
    createMemberAmountHistoryMutation,
    {
      loading: isCreateMemberAmountHistoryLoading,
      data: createMemberAmountHistoryData,
    },
  ] = useCreateMemberAmountHistoryMutation();
  const [
    updateMemberAmountHistoryMutation,
    {
      loading: isUpdateMemberAmountHistoryLoading,
      data: updateMemberAmountHistoryData,
    },
  ] = useUpdateMemberAmountHistoryMutation();

  const onCreateOrEditPaidAmount = values => {
    console.log({
      component: CreateOrEditPaidAmount.name,
      values,
      values,
      accountId,
    });
    if (amountHistory?._id) {
      updateMemberAmountHistoryMutation({
        variables: {
          updateMemberAmountHistoryDto: {
            ...values,
            amountHistoryId: amountHistory?._id,
          },
        },
        refetchQueries: [
          {
            query: GET_SOCIETY_ACCOUNTS_QUERY,
            variables: {
              getSocietyAccountsDto: {
                societyId: defaultAccount?.society?._id,
              },
            },
          },
        ],
      });
    } else {
      createMemberAmountHistoryMutation({
        variables: {
          createMemberAmountHistoryDto: {
            ...values,
            accountId,
          },
        },
        refetchQueries: [
          {
            query: GET_SOCIETY_ACCOUNTS_QUERY,
            variables: {
              getSocietyAccountsDto: {
                societyId: defaultAccount?.society?._id,
              },
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (createMemberAmountHistoryData || updateMemberAmountHistoryData) {
      navigation.goBack();
    }
  }, [createMemberAmountHistoryData, updateMemberAmountHistoryData]);

  return (
    <ScrollView keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Enter paid amount fields')}
        </Text>
        <Text>
          {t('Please make sure to fill all required fields before adding cost')}
        </Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={AmountHistoryKeys.amount}
        errors={errors}
        placeholder={t('Paid amount')}
        keyboardType={KeyboardTypes.numeric}
      />

      <View style={[CommonStyles.bigMarginBottom]}>
        <Text style={[CommonStyles.smallMarginBottom]}>
          {t('Pick paid date')}
        </Text>
        <YupDateTimePicker
          control={control}
          name={AmountHistoryKeys.date}
          errors={errors}
        />
      </View>
      <TextButton
        textStyle={[{color: addDescription ? colors.error : colors.primary}]}
        onPress={() => setAddDescription(prevState => !prevState)}
        text={addDescription ? t('Hide description') : t('Add description')}
        buttonStyle={[CommonStyles.smallMarginBottom]}
      />
      {addDescription && (
        <YupTextInput
          containerStyle={[CommonStyles.bigMarginBottom]}
          control={control}
          name={AmountHistoryKeys.description}
          errors={errors}
          placeholder={t('Enter description')}
        />
      )}
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
          isCreateMemberAmountHistoryLoading ||
          isUpdateMemberAmountHistoryLoading
        }
        loading={
          isCreateMemberAmountHistoryLoading ||
          isUpdateMemberAmountHistoryLoading
        }
        onPress={handleSubmit(onCreateOrEditPaidAmount)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {amountHistory?._id ? t('Update') : t('Create')}
        </Text>
      </NetworkButton>
    </ScrollView>
  );
};

export default CreateOrEditPaidAmount;
