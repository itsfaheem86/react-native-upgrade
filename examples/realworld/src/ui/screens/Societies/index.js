import {CommonStyles} from '@config/styles';
import {CommonNumbers} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  Patterns,
  ReplaceableTokens,
} from '@constants/strings';
import {useGetSocietiesQuery} from '@graphql/actions/society/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import SearchBar from '@ui/components/SearchBar';
import SocietyCard from '@ui/components/SocietyCard';
import {bracket} from '@utils';
import {usePagination, useSearchBar} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
const Societies = () => {
  const {t} = useTranslation();
  const [
    getSocietiesQuery,
    {
      loading: isGetSocietiesQueryLoading,
      data: getSocietiesData,
      refetch: refetchSocietiesQuery,
      fetchMore: fetchMoreSocietiesQuery,
    },
  ] = useGetSocietiesQuery();

  const {onEndReached, isPageLoading, onReloadPage, onPausePage, isPageEnd} =
    usePagination(fetchMoreSocietiesQuery);

  const {onChangeFilters} = useSearchBar(refetchSocietiesQuery);

  useEffect(() => {
    getSocietiesQuery();
  }, []);

  const societies = get(getSocietiesData, GraphqlPaths.data, []);
  console.log({component: Societies.name, societies});

  const estimatedTotalSocietiesCount = societies?.length || CommonNumbers.zero;

  const isMountLoading = useRef(true); // To prevent SearchBar unmount/destroy on search
  if (!isGetSocietiesQueryLoading && isMountLoading.current) {
    isMountLoading.current = false;
  }

  return (
    <NetworkFlatList
      style={[CommonStyles.bigPaddingTop, CommonStyles.bigPaddingHorizontal]}
      data={societies}
      loading={isGetSocietiesQueryLoading}
      ListHeaderComponent={
        !isMountLoading.current && (
          <>
            <SearchBar
              placeholder={t('Search societies')}
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
            <View
              style={[
                CommonStyles.fullFlex,
                CommonStyles.bigMarginBottom,
                {
                  flexDirection: FlexDirections.row,
                  alignItems: FlexAlignments.center,
                },
              ]}>
              <Text
                style={[
                  TypographyStyles.title1,
                  {fontWeight: FontWeights.bold},
                ]}>
                {t('Available societies')}
                {bracket(!isPageEnd && estimatedTotalSocietiesCount)
                  ? Patterns.bracketCountPlus.replace(
                      ReplaceableTokens.count,
                      estimatedTotalSocietiesCount,
                    )
                  : Patterns.bracketCount.replace(
                      ReplaceableTokens.count,
                      estimatedTotalSocietiesCount,
                    )}
              </Text>
            </View>
          </>
        )
      }
      emptyMessage={t('No societies')}
      // Heading
      refetch={() => {
        refetchSocietiesQuery();
        onReloadPage();
      }}
      renderItem={({item: society}) => {
        return <SocietyCard society={society} />;
      }}
      onEndReached={onEndReached}
      isPageLoading={isPageLoading}
      delay
    />
  );
};

export default Societies;
