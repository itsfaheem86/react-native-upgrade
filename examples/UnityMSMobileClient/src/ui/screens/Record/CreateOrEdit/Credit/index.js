import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {CommonDelays, ValidationNumbers, zIndices} from '@constants/numbers';
import {
  CommonStrings,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  KeyboardTypes,
  ListModeTypes,
  PickerModeTypes,
  RecordKeys,
  ValidationModes,
} from '@constants/strings';
import {
  useCreateSocietyCreditRecordMutation,
  useUpdateSocietyCreditRecordMutation,
} from '@graphql/actions/book/mutations';
import {
  useGetSocietyAccountsQuery,
  useGetSocietyCreditTypesQuery,
} from '@graphql/actions/society/queries';
import {GET_SOCIETY_WITH_FULL_INFO_QUERY} from '@graphql/queries/society';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import CheckBox from '@ui/components/CheckBox';
import NetworkButton from '@ui/components/NetworkButton';
import NetworkVirtualizedTabScrollView from '@ui/components/NetworkVirtualizedTabScrollView';
import TextButton from '@ui/components/TextButton';
import YupDateTimePicker from '@ui/components/YupDateTimePicker';
import YupPicker from '@ui/components/YupPicker';
import YupTextInput from '@ui/components/YupTextInput';
import {get} from 'lodash';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

// Title and language check done for forms in this component: Check 1
const CreateOrEditCreditRecord = props => {
  const {navigation, route} = props;
  const {params} = route;
  // This is not a good approach to get record from props, I think
  const record = params?.record;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const selectedAccounts = record?.accounts?.map(
    account => account?._id || account,
  );

  const [includeMembers, setIncludeMembers] = useState(
    record ? !!selectedAccounts?.length : true,
  );

  const schema = yup.object().shape({
    [RecordKeys.amount]: yup
      .number()
      .notOneOf(ValidationNumbers.notAllowedAmounts)
      .typeError(t('Amount should be valid'))
      .required(),
    [RecordKeys.description]: yup.string(),
    [RecordKeys.type]: yup.string().required(t('Type should be selected')),
    [RecordKeys.accounts]: yup.array(),
    [RecordKeys.date]: yup.date().required(),
  });
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [RecordKeys.amount]: record?.amount?.toString() ?? CommonStrings.empty,
      [RecordKeys.description]: record?.description ?? CommonStrings.empty,
      [RecordKeys.type]: record?.type?._id ?? CommonStrings.empty,
      [RecordKeys.accounts]: selectedAccounts ?? [],
      [RecordKeys.date]: record?.date ?? moment(),
    },
  });

  const [
    getSocietyCreditTypesQuery,
    {
      loading: isGetSocietyCreditTypesQueryLoading,
      data: getSocietyCreditTypesData,
      refetch: refetchSocietyCreditTypesQuery,
    },
  ] = useGetSocietyCreditTypesQuery();
  const [
    getSocietyAccountsQuery,
    {
      loading: isGetSocietyAccountsQueryLoading,
      data: getSocietyAccountsData,
      refetch: refetchSocietyAccountsQuery,
    },
  ] = useGetSocietyAccountsQuery();

  useEffect(() => {
    // Why, Refresh controller not showing at first render if I don't add delay
    setTimeout(() => {
      getSocietyAccountsQuery({
        variables: {
          getSocietyAccountsDto: {},
        },
      });
    }, CommonDelays.small);
  }, []);

  const accounts = get(getSocietyAccountsData, GraphqlPaths.data, []);
  console.log({component: CreateOrEditCreditRecord.name, accounts});
  const [
    createSocietyCreditRecordMutation,
    {
      loading: isCreateSocietyCreditRecordLoading,
      data: createSocietyCreditRecordData,
    },
  ] = useCreateSocietyCreditRecordMutation();

  const [
    updateSocietyCreditRecordMutation,
    {
      loading: isUpdateSocietyCreditRecordLoading,
      data: updateSocietyCreditRecordData,
    },
  ] = useUpdateSocietyCreditRecordMutation();

  useEffect(() => {
    // Why, Refresh controller not showing at first render if I don't add delay
    setTimeout(() => {
      getSocietyCreditTypesQuery();
    }, CommonDelays.small);
  }, []);

  const creditTypes = get(getSocietyCreditTypesData, GraphqlPaths.data, []);
  const [addDescription, setAddDescription] = useState(!!record?.description);
  const mappedSelectionItems = creditTypes?.map(creditType => ({
    label: creditType?.name,
    value: creditType?._id,
  }));

  const mappedSelectionAccounts = accounts?.map(account => ({
    label: account?.member?.name,
    value: account?._id,
  }));

  // To set all members if user clicked to select all members
  const mappedAllAccounts = mappedSelectionAccounts?.map(
    account => account.value,
  );

  // To update picker data after the first render
  const [mappedAccounts, setMappedAccounts] = useState();

  const onCreateOrEditCreditRecord = values => {
    if (!includeMembers) {
      // Setting includeMembers false removing picker from the dom, which sometime don't set the account value to empty
      values[RecordKeys.accounts] = [];
    }

    if (record?._id) {
      updateSocietyCreditRecordMutation({
        variables: {
          updateSocietyCreditRecordDto: {...values, recordId: record?._id},
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    } else {
      createSocietyCreditRecordMutation({
        variables: {
          createSocietyCreditRecordDto: values,
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    }
  };

  const onSelectAllMembers = () => {
    setMappedAccounts(mappedAllAccounts);
  };
  const onClearAllMembers = () => {
    setMappedAccounts([]);
  };

  useEffect(() => {
    // Only trigger this on new records
    if (!record) {
      onSelectAllMembers();
    }
    // getSocietyAccountsData will only change all selected accounts
  }, [getSocietyAccountsData]);

  useEffect(() => {
    if (createSocietyCreditRecordData || updateSocietyCreditRecordData) {
      navigation.goBack();
    }
  }, [createSocietyCreditRecordData, updateSocietyCreditRecordData]);

  console.log({
    component: CreateOrEditCreditRecord.name,
    mappedAllAccounts,
    selectedAccounts,
    mappedAccounts,
  });

  return (
    <NetworkVirtualizedTabScrollView
      refreshing={
        isGetSocietyCreditTypesQueryLoading || isGetSocietyAccountsQueryLoading
      }
      onRefresh={() => {
        refetchSocietyCreditTypesQuery();
        refetchSocietyAccountsQuery();
      }}
      style={[CommonStyles.bigMarginTop, CommonStyles.bigPaddingHorizontal]}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Enter revenue fields')}
        </Text>
        <Text>
          {t(
            'Please make sure to fill all required fields before adding revenue',
          )}
        </Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={RecordKeys.amount}
        errors={errors}
        placeholder={t('Revenue amount')}
        keyboardType={KeyboardTypes.numeric}
      />
      <YupPicker
        items={mappedSelectionItems}
        placeholder={t('Select type')}
        // searchPlaceholder={t('Search type')}
        // searchable
        control={control}
        zIndex={zIndices.first}
        name={RecordKeys.type}
        containerStyle={[CommonStyles.bigMarginBottom]}
        errors={errors}
      />
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text style={[CommonStyles.smallMarginBottom]}>
          {t('Pick record date')}
        </Text>
        <YupDateTimePicker
          control={control}
          name={RecordKeys.date}
          errors={errors}
        />
      </View>
      <CheckBox
        defaultValue={includeMembers}
        onToggle={isChecked => {
          onSelectAllMembers();
          setIncludeMembers(isChecked);
        }}
        containerStyle={[CommonStyles.bigMarginBottom]}
        text={t('Include members')}
      />
      {includeMembers && (
        <View
          style={[
            {
              flexDirection: FlexDirections.row,
              justifyContent: FlexAlignments.spaceBetween,
            },
            CommonStyles.bigMarginBottom,
          ]}>
          <TextButton
            textStyle={{color: colors.primary}}
            text={t('Select all members')}
            onPress={onSelectAllMembers}
          />
          <TextButton
            textStyle={{color: colors.primary}}
            text={t('Clear members')}
            onPress={onClearAllMembers}
          />
        </View>
      )}
      {includeMembers && (
        <YupPicker
          items={mappedSelectionAccounts}
          placeholder={t('Select members')}
          searchPlaceholder={t('Search members')}
          searchable
          multiple
          zIndex={zIndices.second}
          control={control}
          name={RecordKeys.accounts}
          containerStyle={[CommonStyles.bigMarginBottom]}
          errors={errors}
          pickerModeType={PickerModeTypes.badge}
          initialSelected={mappedAccounts}
          listMode={ListModeTypes.MODAL}
        />
      )}
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
          name={RecordKeys.description}
          errors={errors}
          placeholder={t('Description')}
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
          isCreateSocietyCreditRecordLoading ||
          isUpdateSocietyCreditRecordLoading ||
          isGetSocietyAccountsQueryLoading ||
          isGetSocietyCreditTypesQueryLoading
        }
        loading={
          isCreateSocietyCreditRecordLoading ||
          isUpdateSocietyCreditRecordLoading
        }
        onPress={handleSubmit(onCreateOrEditCreditRecord)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {!!record?._id ? t('Update') : t('Create')}
        </Text>
      </NetworkButton>
    </NetworkVirtualizedTabScrollView>
  );
};

export default CreateOrEditCreditRecord;
