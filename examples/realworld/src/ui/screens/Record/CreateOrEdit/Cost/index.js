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
  useCreateSocietyCostRecordMutation,
  useUpdateSocietyCostRecordMutation,
} from '@graphql/actions/book/mutations';
import {
  useGetSocietyAccountsQuery,
  useGetSocietyCostTypesQuery,
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
const CreateOrEditCostRecord = props => {
  const {navigation, route} = props;
  const {params} = route;
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
    getSocietyCostTypesQuery,
    {
      loading: isGetSocietyCostTypesQueryLoading,
      data: getSocietyCostTypesData,
      refetch: refetchSocietyCostTypesQuery,
    },
  ] = useGetSocietyCostTypesQuery();

  const [
    createSocietyCostRecordMutation,
    {
      loading: isCreateSocietyCostRecordLoading,
      data: createSocietyCostRecordData,
    },
  ] = useCreateSocietyCostRecordMutation();

  const [
    updateSocietyCostRecordMutation,
    {
      loading: isUpdateSocietyCostRecordLoading,
      data: updateSocietyCostRecordData,
    },
  ] = useUpdateSocietyCostRecordMutation();

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

  const costTypes = get(getSocietyCostTypesData, GraphqlPaths.data, []);

  const [addDescription, setAddDescription] = useState(!!record?.description);

  const mappedSelectionTypes = costTypes?.map(costType => ({
    label: costType?.name,
    value: costType?._id,
  }));

  const accounts = get(getSocietyAccountsData, GraphqlPaths.data, []);
  console.log({component: CreateOrEditCostRecord.name, accounts});

  const mappedSelectionAccounts = accounts?.map(account => ({
    label: account?.member?.name,
    value: account?._id,
  }));

  const onCreateOrEditCostRecord = values => {
    if (!includeMembers) {
      // Setting includeMembers false removing picker from the dom, which sometime don't set the account value to empty
      values[RecordKeys.accounts] = [];
    }
    if (record?._id) {
      updateSocietyCostRecordMutation({
        variables: {
          updateSocietyCostRecordDto: {...values, recordId: record?._id},
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    } else {
      createSocietyCostRecordMutation({
        variables: {
          createSocietyCostRecordDto: values,
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    }
  };

  useEffect(() => {
    // Why, Refresh controller not showing at first render if I don't add delay
    setTimeout(() => {
      getSocietyCostTypesQuery();
    }, CommonDelays.small);
  }, []);

  useEffect(() => {
    if (createSocietyCostRecordData || updateSocietyCostRecordData) {
      navigation.goBack();
    }
  }, [createSocietyCostRecordData, updateSocietyCostRecordData]);

  const [mappedAccounts, setMappedAccounts] = useState();

  const mappedAllAccounts = mappedSelectionAccounts?.map(
    account => account.value,
  );

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

  return (
    <NetworkVirtualizedTabScrollView
      refreshing={
        isGetSocietyCostTypesQueryLoading || isGetSocietyAccountsQueryLoading
      }
      onRefresh={() => {
        refetchSocietyCostTypesQuery();
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
          {t('Enter cost fields')}
        </Text>
        <Text>
          {t('Please make sure to fill all required fields before adding cost')}
        </Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={RecordKeys.amount}
        errors={errors}
        placeholder={t('Cost amount')}
        keyboardType={KeyboardTypes.numeric}
      />
      <YupPicker
        items={mappedSelectionTypes}
        placeholder={t('Select type')}
        // searchPlaceholder={t('Search type')}
        // searchable
        control={control}
        name={RecordKeys.type}
        containerStyle={[CommonStyles.bigMarginBottom]}
        errors={errors}
        zIndex={zIndices.first}
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
          placeholder={t('Select one or more members')}
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
          isCreateSocietyCostRecordLoading ||
          isUpdateSocietyCostRecordLoading ||
          isGetSocietyAccountsQueryLoading ||
          isGetSocietyCostTypesQueryLoading
        }
        loading={
          isCreateSocietyCostRecordLoading || isUpdateSocietyCostRecordLoading
        }
        onPress={handleSubmit(onCreateOrEditCostRecord)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {record?._id ? t('Update') : t('Create')}
        </Text>
      </NetworkButton>
    </NetworkVirtualizedTabScrollView>
  );
};

export default CreateOrEditCostRecord;
