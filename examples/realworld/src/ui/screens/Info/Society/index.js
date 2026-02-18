import {CommonStyles} from '@config/styles';
import {
  GraphqlPaths,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetSocietyRecordsQuery} from '@graphql/actions/book/queries';
import {useGetSocietyWithFullInfoQuery} from '@graphql/actions/society/queries';
import {FontWeights, TypographyStyles} from '@typography';
import FAB from '@ui/atoms/FAB';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import SocietyRecordCard from '@ui/components/RecordCard/Society';
import SocietyInfoCard from '@ui/components/SocietyInfoCard';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
const SocietyInfo = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const auth = useSelector(state => state?.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];

  const userType = auth[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;

  const [
    getSocietyWithFullInfoQuery,
    {
      loading: isGetSocietyWithFullInfoQueryLoading,
      data: getSocietyWithFullInfoData,
      refetch: refetchSocietyWithFullInfoQuery,
    },
  ] = useGetSocietyWithFullInfoQuery();

  const [
    getSocietyRecordsQuery,
    {
      loading: isGetSocietyRecordsQueryLoading,
      data: getSocietyRecordsData,
      refetch: refetchSocietyRecordsQuery,
      fetchMore: fetchMoreSocietyRecordsQuery,
    },
  ] = useGetSocietyRecordsQuery();

  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreSocietyRecordsQuery,
  );

  useEffect(() => {
    getSocietyWithFullInfoQuery({
      variables: {
        getSocietyDto: {
          societyId: defaultAccount?.society?._id,
        },
      },
    });
    getSocietyRecordsQuery({
      variables: {
        getSocietyRecordsDto: {
          societyId: defaultAccount?.society?._id,
        },
      },
    });
  }, [defaultAccount]);

  const societyInfo = get(getSocietyWithFullInfoData, GraphqlPaths.data);
  console.log({component: SocietyInfo.name, societyInfo});

  // For some ui/ux
  const records =
    societyInfo && get(getSocietyRecordsData, GraphqlPaths.data, []);
  console.log({component: SocietyInfo.name, records});
  return (
    <>
      <NetworkFlatList
        contentContainerStyle={[
          CommonStyles.bigPaddingTop,
          CommonStyles.bigPaddingHorizontal,
        ]}
        data={records}
        refetch={() => {
          refetchSocietyRecordsQuery();
          refetchSocietyWithFullInfoQuery();
          onReloadPage();
        }}
        loading={
          isGetSocietyRecordsQueryLoading ||
          isGetSocietyWithFullInfoQueryLoading
        }
        ListHeaderComponent={
          societyInfo && (
            <View style={[CommonStyles.bigMarginBottom]}>
              <SocietyInfoCard
                societyInfo={societyInfo}
                navigation={navigation}
              />
              {!isGetSocietyRecordsQueryLoading && (
                <Text
                  style={[
                    TypographyStyles.title1,
                    {fontWeight: FontWeights.bold},
                  ]}>
                  {t('Recent records')}
                </Text>
              )}
            </View>
          )
        }
        emptyMessage={t('No records')}
        renderItem={({item: record}) => {
          return <SocietyRecordCard {...props} record={record} />;
        }}
        onEndReached={onEndReached}
        isPageLoading={isPageLoading}
        delay
      />
      {isSociety && (
        <FAB
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditRecord);
          }}
          style={{bottom: 0}}
        />
      )}
    </>
  );
};

export default SocietyInfo;
