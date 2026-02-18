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
  GraphqlPaths,
  KeyboardShouldPersistTypes,
  MomentUnitOfTimes,
  ReportCategory,
  ReportType,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetMemberReportsQuery} from '@graphql/actions/report/queries';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import NetworkScrollView from '@ui/components/NetworkScrollView';
import {bracket, getMemberCumulativeArrearsFromReport} from '@utils';
import {get} from 'lodash';
import moment from 'moment';
import {Fragment, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useWindowDimensions, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {useSelector} from 'react-redux';

const MemberAnalytics = props => {
  const {route} = props;
  const params = route?.params;
  const accountIdFromParams = params?.accountId;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];
  const societyId = isMember ? defaultAccount?.society?._id : userId;
  const accountId = accountIdFromParams || defaultAccount?._id;

  const [
    getMemberReportsQuery,
    {
      loading: isGetMemberReportsQueryLoading,
      data: getMemberReportsData,
      refetch: refetchMemberReportsQuery,
    },
  ] = useGetMemberReportsQuery();
  useEffect(() => {
    const from = moment
      .utc()
      .subtract(CommonNumbers.one, MomentUnitOfTimes.year)
      .add(CommonNumbers.one, MomentUnitOfTimes.week)
      .startOf(MomentUnitOfTimes.month)
      .toDate();
    const to = moment.utc().endOf(MomentUnitOfTimes.month).toDate(); // Need to test against edge cases
    if (from && to && societyId && accountId) {
      getMemberReportsQuery({
        variables: {
          getMemberReportsDto: {
            societyId,
            accountId,
            from,
            to,
            category: ReportCategory.monthly,
            type: ReportType.cumulative,
          },
        },
      });
    }
  }, [societyId, accountId]);
  const reports = get(getMemberReportsData, GraphqlPaths.data, []);
  console.log({component: MemberAnalytics.name, reports});

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = CommonNumbers.one) => colors.primary,
    decimalPlaces: CommonNumbers.zero,
  };
  const labels = reports?.map(report => {
    const label = moment(report?.date).format(DateFormats.sortMonthName);
    return label;
  });
  // const cumulativeReceivableLine = reports?.map(report => {
  //   return report?.receivablesTotal;
  // });

  // const cumulativeIncomeLine = reports?.map(report => {
  //   return -report?.amountHistoryTotal;
  // });

  const cumulativeArrearLine = reports?.map(report => {
    return getMemberCumulativeArrearsFromReport(report);
  });

  return (
    <NetworkScrollView
      refreshing={isGetMemberReportsQueryLoading}
      onRefresh={refetchMemberReportsQuery}
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}>
      {!isGetMemberReportsQueryLoading && (
        <Fragment>
          <View style={[CommonStyles.bigMarginBottom]}>
            <Text
              style={[
                TypographyStyles.title1,
                {fontWeight: FontWeights.bold},
                CommonStyles.smallMarginBottom,
              ]}>
              {t('Analytics')}
            </Text>
            <Text>{t('Cumulative member analytics of this year')}</Text>
          </View>
          {!reports?.length && (
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
                {t('No member analytic reports')}
              </Text>
            </View>
          )}
        </Fragment>
      )}
      {!!reports?.length && (
        <LineChart
          data={{
            labels: labels,
            legend: [t('Arrear')],
            datasets: [
              // {
              //   data: cumulativeReceivableLine,
              //   color: (opacity = CommonNumbers.one) => CommonColors.orange,
              // },
              {
                data: cumulativeArrearLine,
                color: (opacity = CommonNumbers.one) => CommonColors.navyBlue,
              },
              // {
              //   data: cumulativeIncomeLine,
              //   color: (opacity = CommonNumbers.one) => colors.primary,
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

export default MemberAnalytics;
