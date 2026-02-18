import {CommonStyles} from '@config/styles';
import {CommonDelays} from '@constants/numbers';
import {BookCategory, GraphqlPaths} from '@constants/strings';
import {useGetSocietyCostTypesQuery} from '@graphql/actions/society/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import NetworkVirtualizedTabScrollView from '@ui/components/NetworkVirtualizedTabScrollView';
import TypeCard from '@ui/components/TypeCard';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
const CostTypes = props => {
  const {t} = useTranslation();
  const [
    getSocietyCostTypesQuery,
    {
      loading: isGetSocietyCostTypesQueryLoading,
      data: getSocietyCostTypesData,
      refetch: refetchSocietyCostTypesQuery,
      fetchMore: fetchMoreSocietyCostTypesQuery,
    },
  ] = useGetSocietyCostTypesQuery();

  useEffect(() => {
    setTimeout(() => {
      getSocietyCostTypesQuery();
    }, CommonDelays.small);
  }, []);

  const costTypes = get(getSocietyCostTypesData, GraphqlPaths.data, []);
  const {onEndReached, isPageLoading, onReloadPage} = usePagination(
    fetchMoreSocietyCostTypesQuery,
  );

  return (
    <NetworkVirtualizedTabScrollView
      refreshing={isGetSocietyCostTypesQueryLoading}
      onRefresh={() => {
        refetchSocietyCostTypesQuery();
        onReloadPage();
      }}>
      <NetworkFlatList
        style={[CommonStyles.bigPaddingTop, CommonStyles.bigPaddingHorizontal]}
        data={costTypes}
        loading={isGetSocietyCostTypesQueryLoading}
        ListHeaderComponent={
          !isGetSocietyCostTypesQueryLoading && (
            <Text
              style={[
                TypographyStyles.title1,
                {fontWeight: FontWeights.bold},
                CommonStyles.bigMarginBottom,
              ]}>
              {t('Cost types')}
            </Text>
          )
        }
        emptyMessage={t('No cost types')}
        renderItem={({item: costType}) => {
          return (
            <TypeCard {...props} bookType={BookCategory.cost} type={costType} />
          );
        }}
        isPageLoading={isPageLoading}
        onEndReached={onEndReached}
        delay
      />
    </NetworkVirtualizedTabScrollView>
  );
};

export default CostTypes;
