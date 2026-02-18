import {CommonStyles} from '@config/styles';
import {CommonDelays} from '@constants/numbers';
import {BookCategory, GraphqlPaths} from '@constants/strings';
import {useGetSocietyCreditTypesQuery} from '@graphql/actions/society/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import NetworkVirtualizedTabScrollView from '@ui/components/NetworkVirtualizedTabScrollView';
import TypeCard from '@ui/components/TypeCard';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
const CreditTypes = props => {
  const {t} = useTranslation();
  const [
    getSocietyCreditTypesQuery,
    {
      loading: isGetSocietyCreditTypesQueryLoading,
      data: getSocietyCreditTypesData,
      refetch: refetchSocietyCreditTypesQuery,
      fetchMore: fetchMoreSocietyCreditTypesQuery,
    },
  ] = useGetSocietyCreditTypesQuery();

  useEffect(() => {
    // Why, Refresh controller not showing at first render if I don't add delay
    setTimeout(() => {
      getSocietyCreditTypesQuery();
    }, CommonDelays.small);
  }, []);

  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreSocietyCreditTypesQuery,
  );

  const creditTypes = get(getSocietyCreditTypesData, GraphqlPaths.data, []);
  return (
    <NetworkVirtualizedTabScrollView
      refreshing={isGetSocietyCreditTypesQueryLoading}
      onRefresh={() => {
        refetchSocietyCreditTypesQuery();
        onReloadPage();
      }}>
      <NetworkFlatList
        style={[CommonStyles.bigPaddingTop, CommonStyles.bigPaddingHorizontal]}
        data={creditTypes}
        loading={isGetSocietyCreditTypesQueryLoading}
        ListHeaderComponent={
          !isGetSocietyCreditTypesQueryLoading && (
            <Text
              style={[
                TypographyStyles.title1,
                {fontWeight: FontWeights.bold},
                CommonStyles.bigMarginBottom,
              ]}>
              {t('Revenue types')}
            </Text>
          )
        }
        emptyMessage={t('No revenue types')}
        renderItem={({item: creditType}) => {
          return (
            <TypeCard
              {...props}
              bookType={BookCategory.credit}
              type={creditType}
            />
          );
        }}
        isPageLoading={isPageLoading}
        onEndReached={onEndReached}
        delay
      />
    </NetworkVirtualizedTabScrollView>
  );
};

export default CreditTypes;
