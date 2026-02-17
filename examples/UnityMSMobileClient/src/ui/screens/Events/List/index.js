import {CommonStyles} from '@config/styles';
import {
  GraphqlPaths,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetSocietyEventsQuery} from '@graphql/actions/event/queries';
import {FontWeights, TypographyStyles} from '@typography';
import FAB from '@ui/atoms/FAB';
import Text from '@ui/atoms/Text';
import SocietyEventCard from '@ui/components/EventCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
const Events = props => {
  const {t} = useTranslation();
  const {navigation} = props;
  const auth = useSelector(state => state.auth);
  const userType = auth[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;
  const defaultAccount = auth[UserKeys.defaultAccount];
  const societyId = defaultAccount?.society?._id;

  const [
    getSocietyEventsQuery,
    {
      loading: isGetSocietyEventsQueryLoading,
      data: getSocietyEventsData,
      refetch: refetchSocietyEventsQuery,
    },
  ] = useGetSocietyEventsQuery();

  useEffect(() => {
    getSocietyEventsQuery({
      variables: {
        getSocietyEventsDto: {societyId},
      },
    });
  }, []);

  const events = get(getSocietyEventsData, GraphqlPaths.data, []);
  console.log({component: Events.name, events});
  return (
    <>
      <NetworkFlatList
        style={[CommonStyles.bigPaddingTop, CommonStyles.bigPaddingHorizontal]}
        data={events}
        refetch={() => {
          refetchSocietyEventsQuery();
        }}
        loading={isGetSocietyEventsQueryLoading}
        ListHeaderComponent={
          !isGetSocietyEventsQueryLoading && (
            <Text
              style={[
                TypographyStyles.title1,
                {fontWeight: FontWeights.bold},
                CommonStyles.bigMarginBottom,
              ]}>
              {t('Events')}
            </Text>
          )
        }
        emptyMessage={t('No events')}
        renderItem={({item: event}) => {
          return <SocietyEventCard event={event} navigation={navigation} />;
        }}
        delay
      />
      {isSociety && (
        <FAB
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditEvent);
          }}
        />
      )}
    </>
  );
};

export default Events;
