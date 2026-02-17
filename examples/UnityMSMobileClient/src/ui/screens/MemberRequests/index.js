import {CommonStyles} from '@config/styles';
import {CommonNumbers} from '@constants/numbers';
import {GraphqlPaths, Patterns, ReplaceableTokens} from '@constants/strings';
import {useGetSocietyAccountRequestsQuery} from '@graphql/actions/society/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import AccountCard from '@ui/components/AccountCard';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import SearchBar from '@ui/components/SearchBar';
import {bracket} from '@utils';
import {usePagination, useSearchBar} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
const MemberRequests = props => {
  const {t} = useTranslation();

  const [
    getSocietyAccountRequestsQuery,
    {
      loading: isGetSocietyAccountRequestsQueryLoading,
      data: getSocietyAccountRequestsData,
      refetch: refetchSocietyAccountRequestsQuery,
      fetchMore: fetchMOreSocietyAccountRequestsQuery,
    },
  ] = useGetSocietyAccountRequestsQuery();

  const {onEndReached, isPageLoading, onReloadPage, onPausePage, isPageEnd} =
    usePagination(fetchMOreSocietyAccountRequestsQuery);

  const {onChangeFilters} = useSearchBar(refetchSocietyAccountRequestsQuery);

  useEffect(() => {
    getSocietyAccountRequestsQuery();
  }, []);

  // Once society accept it, not disappearing
  // For ui/ux purpose I am filtering accounts with not active state
  const accounts = get(
    getSocietyAccountRequestsData,
    GraphqlPaths.data,
    [],
  )?.filter(account => !account?.active);
  console.log({component: MemberRequests.name, accounts});
  const estimatedTotalAccountRequestsCount =
    accounts?.length || CommonNumbers.zero;

  const isMountLoading = useRef(true); // To prevent SearchBar unmount/destroy on search
  if (!isGetSocietyAccountRequestsQueryLoading && isMountLoading.current) {
    isMountLoading.current = false;
  }

  return (
    <NetworkFlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      data={accounts}
      loading={isGetSocietyAccountRequestsQueryLoading}
      ListHeaderComponent={
        <View style={[CommonStyles.fullFlex]}>
          {!isMountLoading.current && (
            <>
              <SearchBar
                placeholder={t('Search requests')}
                style={[CommonStyles.bigMarginBottom]}
                onChangeText={text => {
                  onChangeFilters({query: text});
                  if (text) {
                    onPausePage();
                  } else {
                    onReloadPage();
                  }
                }}
              />
              <Text
                style={[
                  TypographyStyles.title1,
                  {fontWeight: FontWeights.bold},
                  CommonStyles.bigMarginBottom,
                ]}>
                {t('Account requests')}
                {bracket(!isPageEnd && estimatedTotalAccountRequestsCount)
                  ? Patterns.bracketCountPlus.replace(
                      ReplaceableTokens.count,
                      estimatedTotalAccountRequestsCount,
                    )
                  : Patterns.bracketCount.replace(
                      ReplaceableTokens.count,
                      estimatedTotalAccountRequestsCount,
                    )}
              </Text>
            </>
          )}
        </View>
      }
      emptyMessage={t('No requests')}
      refetch={() => {
        refetchSocietyAccountRequestsQuery();
        onReloadPage();
      }}
      renderItem={({item: account}) => {
        return (
          <AccountCard {...props} account={account} hideSensitiveInfo={true} />
        );
      }}
      isPageLoading={isPageLoading}
      onEndReached={onEndReached}
      delay
    />
  );
};

export default MemberRequests;
