import {CommonStyles} from '@config/styles';
import {CommonNumbers} from '@constants/numbers';
import {
  DESC,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  MomentUnitOfTimes,
  Patterns,
  ReplaceableTokens,
  ReportCategory,
  ReportType,
  UserKeys,
} from '@constants/strings';
import {useGetSocietyReportsQuery} from '@graphql/actions/report/queries';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkFlatList from '@ui/components/NetworkFlatList';
import ReportCard from '@ui/components/ReportCard';
import {bracket} from '@utils';
import {usePagination} from '@utils/hooks';
import {get} from 'lodash';
import moment from 'moment';
import {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const Reports = () => {
  const {t} = useTranslation();
  const auth = useSelector(state => state?.auth);
  const societyId = auth?.[UserKeys._id];
  const [
    getSocietyReportsQuery,
    {
      loading: isGetSocietyReportsQueryLoading,
      data: getSocietyReportsData,
      refetch: refetchSocietyReportsQuery,
      fetchMore: fetchMoreSocietyReportsQuery,
      variables: getSocietyReportsVariables,
    },
  ] = useGetSocietyReportsQuery();

  const {onEndReached, isPageLoading, onReloadPage, isPageEnd} = usePagination(
    fetchMoreSocietyReportsQuery,
    getSocietyReportsVariables,
  );

  const to = useMemo(
    () => moment.utc().endOf(MomentUnitOfTimes.month).toDate(),
    [],
  );
  const category = ReportCategory.monthly;
  const type = ReportType.cumulative;
  useEffect(() => {
    if (to) {
      getSocietyReportsQuery({
        variables: {
          getSocietyReportsDto: {
            societyId,
            to,
            category,
            type,
          },
          paginationDto: {
            sortOrder: DESC,
          },
        },
      });
    }
  }, [societyId, to, category, type]);
  const reports = get(getSocietyReportsData, GraphqlPaths.data, []);
  console.log({component: Reports.name, reports});
  const estimatedTotalSocietyReportsCount =
    reports?.length || CommonNumbers.zero;

  return (
    <NetworkFlatList
      style={[CommonStyles.bigPaddingTop, CommonStyles.bigPaddingHorizontal]}
      data={reports}
      loading={isGetSocietyReportsQueryLoading}
      ListHeaderComponent={
        !isGetSocietyReportsQueryLoading && (
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
              style={[TypographyStyles.title1, {fontWeight: FontWeights.bold}]}>
              {t('Available reporters')}
              {bracket(!isPageEnd && estimatedTotalSocietyReportsCount)
                ? Patterns.bracketCountPlus.replace(
                    ReplaceableTokens.count,
                    estimatedTotalSocietyReportsCount,
                  )
                : Patterns.bracketCount.replace(
                    ReplaceableTokens.count,
                    estimatedTotalSocietyReportsCount,
                  )}
            </Text>
          </View>
        )
      }
      emptyMessage={t('No reports')}
      // Heading
      refetch={() => {
        refetchSocietyReportsQuery();
        onReloadPage();
      }}
      renderItem={({item: report}) => {
        return <ReportCard report={report} />;
      }}
      onEndReached={onEndReached}
      isPageLoading={isPageLoading}
      delay
    />
  );
};

export default Reports;
