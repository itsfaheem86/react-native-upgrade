import {CommonStyles} from '@config/styles';
import {IconSizes} from '@constants/numbers';
import {
  DateFormats,
  Directories,
  ErrorMessages,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  IconNames,
  MomentUnitOfTimes,
  Patterns,
  ReplaceableTokens,
  ReportCategory,
  ReportType,
  UserKeys,
} from '@constants/strings';
import {useGetMeQuery} from '@graphql/actions/auth/queries';
import {useGetSocietyMembersReportsQuery} from '@graphql/actions/report/queries';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {
  getFormattedDate,
  getSocietyCumulativeAssetFromReport,
  getSocietyCumulativeMoneyInHandFromReport,
  showDefaultToast,
} from '@utils';
import {isErrorToastable} from '@utils/error';
import {getSocietyMembersReportsHtml} from '@utils/html';
import {get} from 'lodash';
import moment from 'moment';
import {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Badge} from 'react-native-paper';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
import NetworkIconButton from '../NetworkIconButton';
import styles from './styles';

const ReportCard = props => {
  const {report: currentMonthSocietyReport} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const auth = useSelector(state => state?.auth);
  const societyId = auth?.[UserKeys._id];
  const [getMeQuery, {data: getMeData, loading: isGetMeLoading}] =
    useGetMeQuery();
  const user = get(getMeData, GraphqlPaths.data);
  const [
    getSocietyMembersReportsQuery,
    {loading: isGetSocietyMembersReportsQueryLoading},
  ] = useGetSocietyMembersReportsQuery();

  const from = useMemo(
    () =>
      moment(currentMonthSocietyReport?.date)
        .startOf(MomentUnitOfTimes.month)
        .toDate(),
    [currentMonthSocietyReport],
  );
  const to = useMemo(
    () =>
      moment(currentMonthSocietyReport?.date)
        .endOf(MomentUnitOfTimes.month)
        .toDate(),
    [currentMonthSocietyReport],
  );
  const category = ReportCategory.monthly;
  const type = ReportType.cumulative;

  const onViewPdfReports = async () => {
    try {
      const {data} = await getSocietyMembersReportsQuery({
        variables: {
          getSocietyMembersReportsDto: {
            societyId,
            from,
            to,
            category,
            type,
          },
        },
      });
      const membersReports = get(data, GraphqlPaths.data, []);
      console.log({membersReports});
      // Generate pdf
      const html = getSocietyMembersReportsHtml(user, membersReports, [
        currentMonthSocietyReport,
      ]);
      const options = {
        html: html,
        fileName: Patterns.reportsName
          .replace(
            ReplaceableTokens.from,
            moment(from).format(DateFormats.yearMonthDateWithoutSlash),
          )
          .replace(
            ReplaceableTokens.to,
            moment(to).format(DateFormats.yearMonthDateWithoutSlash),
          ),
        directory: Directories.documents,
      };
      const file = await RNHTMLtoPDF.convert(options);
      if (file) {
        await Share.open({
          url: Patterns.filePath.replace(ReplaceableTokens.path, file.filePath),
          saveToFiles: true,
        });
      }
    } catch (e) {
      if (isErrorToastable(e)) {
        showDefaultToast({message: e?.message || ErrorMessages.UnknownError});
      }
    }
  };

  useEffect(() => {
    getMeQuery();
  }, []);

  const currentMonthCumulativeMoneyInHand =
    getSocietyCumulativeMoneyInHandFromReport(currentMonthSocietyReport);
  const currentMonthCumulativeAsset = getSocietyCumulativeAssetFromReport(
    currentMonthSocietyReport,
  );

  return (
    <View
      style={[
        styles.defaultAmountHistoryCard,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        {
          backgroundColor: colors.card2,
          flexDirection: FlexDirections.row,
          alignItems: FlexAlignments.center,
        },
      ]}>
      <View style={[CommonStyles.fullFlex]}>
        <View
          style={[
            {flexDirection: FlexDirections.row},
            CommonStyles.smallMarginBottom,
          ]}>
          <Text style={[{fontWeight: FontWeights.medium}]}>
            {t('Report on')}
          </Text>
          <Text
            style={[
              CommonStyles.smallMarginLeft,
              {fontWeight: FontWeights.medium},
            ]}>
            {getFormattedDate(currentMonthSocietyReport?.date)}
          </Text>
        </View>
        <View style={[{flexDirection: FlexDirections.row}]}>
          <View
            style={[
              {flexDirection: FlexDirections.row},
              CommonStyles.bigMarginRight,
            ]}>
            <Badge
              style={[
                {
                  backgroundColor: CommonColors.pink,
                  fontWeight: FontWeights.medium,
                  color: colors.light,
                },
                CommonStyles.smallMarginRight,
              ]}>
              {t('Money in hand')}
            </Badge>
            <Text style={[TypographyStyles.caption1, {color: colors.accent}]}>
              {currentMonthCumulativeMoneyInHand}
            </Text>
          </View>
          <View
            style={[
              {flexDirection: FlexDirections.row},
              CommonStyles.bigMarginRight,
            ]}>
            <Badge
              style={[
                {
                  backgroundColor: CommonColors.green,
                  fontWeight: FontWeights.medium,
                  color: colors.light,
                },
                CommonStyles.smallMarginRight,
              ]}>
              {t('Total asset')}
            </Badge>
            <Text style={[TypographyStyles.caption1, {color: colors.accent}]}>
              {currentMonthCumulativeAsset}
            </Text>
          </View>
        </View>
      </View>
      <NetworkIconButton
        iconStyle={[{fontSize: IconSizes.normal, color: colors.accent}]}
        onPress={onViewPdfReports}
        iconName={IconNames.shareAlt}
        loading={isGetSocietyMembersReportsQueryLoading || isGetMeLoading}
        buttonStyle={[CommonStyles.bigMarginLeft]}
      />
    </View>
  );
};

export default ReportCard;
