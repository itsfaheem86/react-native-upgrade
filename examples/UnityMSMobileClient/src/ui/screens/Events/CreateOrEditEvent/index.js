import {CommonStyles} from '@config/styles';
import {yup} from '@constants/imports';
import {zIndices} from '@constants/numbers';
import {
  CommonStrings,
  EventKeys,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  KeyboardShouldPersistTypes,
  ListModeTypes,
  PickerModeTypes,
  ValidationModes,
} from '@constants/strings';
import {
  useCreateSocietyEventMutation,
  useUpdateSocietyEventMutation,
} from '@graphql/actions/event/mutations';
import {useGetSocietyAccountsQuery} from '@graphql/actions/society/queries';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import CheckBox from '@ui/components/CheckBox';
import NetworkButton from '@ui/components/NetworkButton';
import NetworkScrollView from '@ui/components/NetworkScrollView';
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

const CreateOrEditEvent = props => {
  const {navigation, route} = props;
  const {params} = route;
  const event = params?.event;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const selectedAccounts = event?.accounts?.map(
    account => account?._id || account,
  );

  const schema = yup.object().shape({
    [EventKeys.title]: yup.string().required(),
    [EventKeys.description]: yup.string(),
    [EventKeys.organizer]: yup
      .string()
      .required(t('Organizer should be selected')),
    [EventKeys.accounts]: yup.array(),
    [EventKeys.date]: yup.date().required(),
  });
  const {
    control,
    formState: {errors, isValid},
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: ValidationModes.all,
    defaultValues: {
      [EventKeys.title]: event?.title ?? CommonStrings.empty,
      [EventKeys.description]: event?.description ?? CommonStrings.empty,
      [EventKeys.organizer]: event?.organizer?._id ?? CommonStrings.empty,
      [EventKeys.accounts]: selectedAccounts ?? [],
      [EventKeys.date]: event?.date ?? moment(),
    },
  });

  const [
    getSocietyAccountsQuery,
    {
      loading: isGetSocietyAccountsQueryLoading,
      data: getSocietyAccountsData,
      refetch: refetchSocietyAccountsQuery,
    },
  ] = useGetSocietyAccountsQuery();
  const accounts = get(getSocietyAccountsData, GraphqlPaths.data, []);
  const mappedSelectionAccounts = accounts?.map(account => ({
    label: account?.member?.name,
    value: account?._id,
  }));

  const [
    createSocietyEventMutation,
    {loading: isCreateSocietyEventLoading, data: createSocietyEventData},
  ] = useCreateSocietyEventMutation();

  const [
    updateSocietyEventMutation,
    {loading: isUpdateSocietyEventLoading, data: updateSocietyEventData},
  ] = useUpdateSocietyEventMutation();

  const onCreateOrEditEvent = values => {
    console.log({component: CreateOrEditEvent.name, values});
    if (!includeAccounts) {
      // Setting includeAccounts false removing picker from the dom, which sometime don't set the account snapshots value to empty
      values[EventKeys.accounts] = [];
    }
    if (event) {
      updateSocietyEventMutation({
        variables: {
          updateSocietyEventDto: {...values, eventId: event?._id},
        },
      });
    } else {
      createSocietyEventMutation({
        variables: {
          createSocietyEventDto: values,
        },
      });
    }
  };

  useEffect(() => {
    getSocietyAccountsQuery({
      variables: {
        getSocietyAccountsDto: {},
      },
    });
  }, []);

  const [includeAccounts, setIncludeAccounts] = useState(
    event ? !!selectedAccounts?.length : true,
  );

  const mappedAllAccounts = mappedSelectionAccounts?.map(
    account => account.value,
  );
  const [mappedAccounts, setMappedAccounts] = useState();
  const onSelectAllAccountSnapshots = () => {
    setMappedAccounts(mappedAllAccounts);
  };
  const onClearAllAccountSnapshots = () => {
    setMappedAccounts([]);
  };

  useEffect(() => {
    // Only trigger this on new events
    if (!event) {
      onSelectAllAccountSnapshots();
    }
    // getSocietyAccountsData will only change all selected accounts
  }, [getSocietyAccountsData]);

  useEffect(() => {
    if (createSocietyEventData || updateSocietyEventData) {
      navigation.goBack();
    }
  }, [createSocietyEventData, updateSocietyEventData]);

  const [addDescription, setAddDescription] = useState(!!event?.description);

  return (
    <NetworkScrollView
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}
      refreshing={isGetSocietyAccountsQueryLoading}
      onRefresh={() => {
        refetchSocietyAccountsQuery();
      }}>
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text
          style={[
            TypographyStyles.title1,
            CommonStyles.smallMarginBottom,
            {color: colors.primary, fontWeight: FontWeights.bold},
          ]}>
          {t('Enter event fields')}
        </Text>
        <Text>
          {t(
            'Please make sure to fill all required fields before adding event',
          )}
        </Text>
      </View>
      <YupTextInput
        containerStyle={[CommonStyles.bigMarginBottom]}
        control={control}
        name={EventKeys.title}
        errors={errors}
        placeholder={t('Event title')}
      />
      <YupPicker
        items={mappedSelectionAccounts}
        placeholder={t('Select organizer')}
        searchPlaceholder={t('Search organizer')}
        searchable
        control={control}
        name={EventKeys.organizer}
        containerStyle={[CommonStyles.bigMarginBottom]}
        errors={errors}
        listMode={ListModeTypes.MODAL}
        // zIndex={zIndices.first}
      />
      <View style={[CommonStyles.bigMarginBottom]}>
        <Text style={[CommonStyles.smallMarginBottom]}>
          {t('Pick event date')}
        </Text>
        <YupDateTimePicker control={control} name={EventKeys.date} />
      </View>

      {/* Include members */}
      <CheckBox
        defaultValue={includeAccounts}
        onToggle={isChecked => {
          onSelectAllAccountSnapshots();
          setIncludeAccounts(isChecked);
        }}
        containerStyle={[CommonStyles.bigMarginBottom]}
        text={t('Include account snapshots')}
      />
      {includeAccounts && (
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
            text={t('Select all accounts')}
            onPress={onSelectAllAccountSnapshots}
          />
          <TextButton
            textStyle={{color: colors.primary}}
            text={t('Clear accounts')}
            onPress={onClearAllAccountSnapshots}
          />
        </View>
      )}
      {includeAccounts && (
        <YupPicker
          items={mappedSelectionAccounts}
          placeholder={t('Select one or more accounts')}
          searchPlaceholder={t('Search account')}
          searchable
          multiple
          zIndex={zIndices.second}
          control={control}
          name={EventKeys.accounts}
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
          name={EventKeys.description}
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
          !isValid || isCreateSocietyEventLoading || isUpdateSocietyEventLoading
        }
        loading={isCreateSocietyEventLoading || isUpdateSocietyEventLoading}
        onPress={handleSubmit(onCreateOrEditEvent)}>
        <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
          {event ? t('Update') : t('Create')}
        </Text>
      </NetworkButton>
    </NetworkScrollView>
  );
};

export default CreateOrEditEvent;
