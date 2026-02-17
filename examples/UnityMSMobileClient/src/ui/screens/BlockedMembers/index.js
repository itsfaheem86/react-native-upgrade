import {CommonStyles} from '@config/styles';
import {CommonNumbers} from '@constants/numbers';
import {GraphqlPaths, Patterns, ReplaceableTokens} from '@constants/strings';
import {useGetSocietyBlockedAccountsQuery} from '@graphql/actions/society/queries';
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
const BlockedMembers = props => {
  const {t} = useTranslation();

  const [
    getSocietyBlockedAccountsQuery,
    {
      loading: isGetSocietyBlockedAccountsQueryLoading,
      data: getSocietyBlockedAccountsData,
      refetch: refetchSocietyBlockedAccountsQuery,
      fetchMore: fetchMOreSocietyBlockedAccountsQuery,
    },
  ] = useGetSocietyBlockedAccountsQuery();

  const {onEndReached, isPageLoading, onReloadPage, onPausePage, isPageEnd} =
    usePagination(fetchMOreSocietyBlockedAccountsQuery);

  const {onChangeFilters} = useSearchBar(refetchSocietyBlockedAccountsQuery);

  useEffect(() => {
    getSocietyBlockedAccountsQuery();
  }, []);

  // Once society accept it, not disappearing
  // For ui/ux purpose I am filtering accounts with not active state
  const accounts = get(
    getSocietyBlockedAccountsData,
    GraphqlPaths.data,
    [],
  )?.filter(account => account?.blocked);
  console.log({component: BlockedMembers.name, accounts});
  const estimatedTotalAccountRequestsCount =
    accounts?.length || CommonNumbers.zero;

  const isMountLoading = useRef(true); // To prevent SearchBar unmount/destroy on search
  if (!isGetSocietyBlockedAccountsQueryLoading && isMountLoading.current) {
    isMountLoading.current = false;
  }

  return (
    <NetworkFlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      data={accounts}
      loading={isGetSocietyBlockedAccountsQueryLoading}
      ListHeaderComponent={
        <View style={[CommonStyles.fullFlex]}>
          {!isMountLoading.current && (
            <>
              <SearchBar
                placeholder={t('Search blocked members')}
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
                {t('Blocked members')}
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
      emptyMessage={t('No blocked members')}
      refetch={() => {
        refetchSocietyBlockedAccountsQuery();
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

export default BlockedMembers;
