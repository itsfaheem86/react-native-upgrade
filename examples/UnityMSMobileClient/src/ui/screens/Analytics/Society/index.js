import {EmptySvg} from '@assets/svgs';
import {CommonStyles} from '@config/styles';
import {
  CommonDegrees,
  CommonHeights,
  CommonNumbers,
  CommonWidths,
  Opacities,
  Paddings,
} from '@constants/numbers';
import {
  DateFormats,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  KeyboardShouldPersistTypes,
  MomentUnitOfTimes,
  ReportCategory,
  ReportType,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetSocietyReportsQuery} from '@graphql/actions/report/queries';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkScrollView from '@ui/components/NetworkScrollView';
import {
  bracket,
  getSocietyCumulativeAssetFromReport,
  getSocietyCumulativeMoneyInHandFromReport,
} from '@utils';
import {get} from 'lodash';
import moment from 'moment';
import {Fragment, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useWindowDimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';

const SocietyAnalytics = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;

  const [
    getSocietyReportsQuery,
    {
      loading: isGetSocietyReportsQueryLoading,
      data: getSocietyReportsData,
      refetch: refetchSocietyReportsQuery,
    },
  ] = useGetSocietyReportsQuery();

  const from = useMemo(
    () =>
      moment
        .utc()
        .subtract(CommonNumbers.one, MomentUnitOfTimes.year)
        .add(CommonNumbers.one, MomentUnitOfTimes.week)
        .startOf(MomentUnitOfTimes.month)
        .toDate(),
    [],
  );
  const to = useMemo(
    () => moment.utc().endOf(MomentUnitOfTimes.month).toDate(),
    [],
  );
  const category = ReportCategory.monthly;
  const type = ReportType.cumulative;
  useEffect(() => {
    if (from && to) {
      getSocietyReportsQuery({
        variables: {
          getSocietyReportsDto: {
            societyId,
            from,
            to,
            category,
            type,
          },
        },
      });
    }
  }, [societyId, from, to, category, type]);
  const societyReports = get(getSocietyReportsData, GraphqlPaths.data, []);
  console.log({component: SocietyAnalytics.name, societyReports});

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = CommonNumbers.one) => colors.primary,
    decimalPlaces: CommonNumbers.zero,
  };

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const labels = societyReports?.map(report => {
    const label = moment(report?.date).format(DateFormats.sortMonthName);
    return label;
  });
  // const cumulativeCostLine = societyReports?.map(report => {
  //   return getSocietyCumulativeCostFromReport(report); // Can invert it to make more visually understandable
  // });

  // const cumulativeIncomeLine = societyReports?.map(report => {
  //   return getSocietyCumulativeIncomeFromReport(report);
  // });
  // const cumulativeReceivableLine = reports?.map(report => {
  //   return report?.receivablesTotal;
  // });
  const cumulativeMoneyInHandLine = societyReports?.map(report => {
    return getSocietyCumulativeMoneyInHandFromReport(report);
  });

  const cumulativeAssetLine = societyReports?.map(report => {
    return getSocietyCumulativeAssetFromReport(report);
  });

  return (
    <NetworkScrollView
      refreshing={isGetSocietyReportsQueryLoading}
      onRefresh={refetchSocietyReportsQuery}
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      {!isGetSocietyReportsQueryLoading && (
        <Fragment>
          <View style={[CommonStyles.bigMarginBottom]}>
            <View
              style={[
                {
                  flexDirection: FlexDirections.row,
                  alignItems: FlexAlignments.center,
                },
              ]}>
              <Text
                style={[
                  TypographyStyles.title1,
                  {fontWeight: FontWeights.bold},
                  CommonStyles.smallMarginBottom,
                ]}>
                {t('Analytics')}
              </Text>
            </View>
            <Text>{t('Cumulative society analytics of this year')}</Text>
          </View>
          {!societyReports?.length && (
            <View
              style={[
                CommonStyles.fullFlex,
                {
                  justifyContent: FlexAlignments.center,
                  alignItems: FlexAlignments.center,
                },
              ]}>
              <EmptySvg
                width={CommonWidths.emptyImage}
                height={CommonHeights.emptyImage}
                pathFill={colors.primaryDark}
              />
              <Text
                style={[
                  TypographyStyles.body1,
                  {color: colors.primaryDark, opacity: Opacities.half},
                ]}>
                {t('No society analytic reports')}
              </Text>
            </View>
          )}
        </Fragment>
      )}
      {!!societyReports?.length && (
        <LineChart
          data={{
            labels: labels,
            legend: [t('Money in hand'), t('Total asset')],
            datasets: [
              // {
              //   data: cumulativeIncomeLine,
              //   color: (opacity = CommonNumbers.one) => colors.primary,
              // },
              {
                data: cumulativeMoneyInHandLine,
                color: (opacity = CommonNumbers.one) => CommonColors.pink,
              },
              {
                data: cumulativeAssetLine,
                color: (opacity = CommonNumbers.one) => CommonColors.green,
              },
              // {
              //   data: cumulativeCostLine,
              //   color: (opacity = CommonNumbers.one) => colors.error,
              // },
              // {
              //   data: receivableLine,
              //   color: (opacity = CommonNumbers.one) => CommonColors.orange,
              // },
            ],
          }}
          width={windowWidth - bracket(CommonNumbers.two * Paddings.big)}
          height={windowHeight / CommonNumbers.two}
          chartConfig={chartConfig}
          formatYLabel={yValue => {
            // return getFormattedCurrency(yValue);
            return yValue;
          }}
          verticalLabelRotation={CommonDegrees.ninety}
          // bezier // Don't need curves I guess
        />
      )}
    </NetworkScrollView>
  );
};

export default SocietyAnalytics;
