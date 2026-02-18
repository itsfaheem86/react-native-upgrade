import {CommonStyles} from '@config/styles';
import {GraphqlPaths, UserKeys} from '@constants/strings';
import {useGetSocietyEventQuery} from '@graphql/actions/event/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import EventAccountCard from '@ui/components/EventAccountCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const EventAccounts = props => {
  const {route} = props;
  const {params} = route;
  const eventId = params?.eventId;
  const auth = useSelector(state => state?.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const {t} = useTranslation();

  const [
    getSocietyEventQuery,
    {
      loading: isGetSocietyEventQueryLoading,
      data: getSocietyEventData,
      refetch: refetchSocietyEventQuery,
    },
  ] = useGetSocietyEventQuery();

  useEffect(() => {
    getSocietyEventQuery({
      variables: {
        getSocietyEventDto: {
          eventId,
          societyId: defaultAccount?.society?._id,
        },
      },
    });
  }, []);

  const eventInfo = get(getSocietyEventData, GraphqlPaths.data);
  console.log({component: EventAccounts.name, eventInfo});
  return (
    <NetworkFlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      ListHeaderComponent={
        !isGetSocietyEventQueryLoading && (
          <Text
            style={[
              TypographyStyles.title1,
              {fontWeight: FontWeights.bold},
              CommonStyles.bigMarginBottom,
            ]}>
            {t('Accounts')}
          </Text>
        )
      }
      data={eventInfo?.accounts}
      loading={isGetSocietyEventQueryLoading}
      emptyMessage={t('No accounts')}
      refetch={refetchSocietyEventQuery}
      renderItem={({item: account}) => {
        return (
          <EventAccountCard {...props} account={account} event={eventInfo} />
        );
      }}
      delay
    />
  );
};

export default EventAccounts;
