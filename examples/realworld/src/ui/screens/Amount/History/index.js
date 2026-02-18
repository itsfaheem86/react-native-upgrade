import {CommonStyles} from '@config/styles';
import {GraphqlPaths, UserKeys, UserTypes} from '@constants/strings';
import {useGetSocietyAmountHistoriesQuery} from '@graphql/actions/book/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import AmountHistoryCard from '@ui/components/AmountHistoryCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const PaidAmountHistory = props => {
  const {t} = useTranslation();
  const {navigation} = props;
  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const userType = auth[UserKeys.userType];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;
  const accountId = defaultAccount?._id;

  const [
    getSocietyAmountHistoriesQuery,
    {
      loading: isGetSocietyAmountHistoriesQueryLoading,
      data: getSocietyAmountHistoriesData,
      refetch: refetchSocietyAmountHistoriesQuery,
      fetchMore: fetchMoreSocietyAmountHistoriesQuery,
    },
  ] = useGetSocietyAmountHistoriesQuery();

  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreSocietyAmountHistoriesQuery,
  );

  useEffect(() => {
    if ((accountId && societyId && isMember) || (!isMember && societyId)) {
      getSocietyAmountHistoriesQuery({
        variables: {
          getSocietyAmountHistoriesDto: {accountId, societyId},
        },
      });
    }
  }, [accountId, societyId]);

  const amountHistories = get(
    getSocietyAmountHistoriesData,
    GraphqlPaths.data,
    [],
  );

  return (
    <>
      <NetworkFlatList
        contentContainerStyle={[
          CommonStyles.bigPaddingTop,
          CommonStyles.bigPaddingHorizontal,
        ]}
        data={amountHistories}
        refetch={() => {
          refetchSocietyAmountHistoriesQuery();
          onReloadPage();
        }}
        loading={isGetSocietyAmountHistoriesQueryLoading}
        ListHeaderComponent={
          !isGetSocietyAmountHistoriesQueryLoading && (
            <Text
              style={[
                TypographyStyles.title1,
                {fontWeight: FontWeights.bold},
                CommonStyles.bigMarginBottom,
              ]}>
              {t('Paid amount history')}
            </Text>
          )
        }
        emptyMessage={t('No history')}
        renderItem={({item: amountHistory}) => {
          return (
            <AmountHistoryCard
              navigation={navigation}
              amountHistory={amountHistory}
              accountId={accountId}
              societyId={societyId}
            />
          );
        }}
        isPageLoading={isPageLoading}
        onEndReached={onEndReached}
        delay
      />
      {/* Need to have a dropdown account selector to add this */}
      {/* {!isMember && (
        <FAB
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
              accountId,
            });
          }}
        />
      )} */}
    </>
  );
};

export default PaidAmountHistory;
