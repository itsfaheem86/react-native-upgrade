import {CommonStyles} from '@config/styles';
import {
  GraphqlPaths,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetMemberAmountHistoriesQuery} from '@graphql/actions/book/queries';
import {FontWeights, TypographyStyles} from '@typography';
import FAB from '@ui/atoms/FAB';
import Text from '@ui/atoms/Text';
import AmountHistoryCard from '@ui/components/AmountHistoryCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const PaidAccountAmountHistory = props => {
  const {t} = useTranslation();
  const {navigation, route} = props;
  const params = route?.params;

  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const userType = auth[UserKeys.userType];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;
  const accountId = params?.accountId;

  const [
    getMemberAmountHistoriesQuery,
    {
      loading: isGetMemberAmountHistoriesQueryLoading,
      data: getMemberAmountHistoriesData,
      refetch: refetchMemberAmountHistoriesQuery,
      fetchMore: fetchMoreMemberAmountHistoriesQuery,
    },
  ] = useGetMemberAmountHistoriesQuery();

  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreMemberAmountHistoriesQuery,
  );

  useEffect(() => {
    if (accountId && societyId) {
      getMemberAmountHistoriesQuery({
        variables: {
          getMemberAmountHistoriesDto: {accountId, societyId},
        },
      });
    }
  }, [accountId, societyId]);

  const amountHistories = get(
    getMemberAmountHistoriesData,
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
          refetchMemberAmountHistoriesQuery();
          onReloadPage();
        }}
        loading={isGetMemberAmountHistoriesQueryLoading}
        ListHeaderComponent={
          !isGetMemberAmountHistoriesQueryLoading && (
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
      {!isMember && (
        <FAB
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
              accountId,
            });
          }}
        />
      )}
    </>
  );
};

export default PaidAccountAmountHistory;
