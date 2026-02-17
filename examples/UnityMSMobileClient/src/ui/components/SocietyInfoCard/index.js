import {CommonStyles} from '@config/styles';
import {BorderWidths, CommonWidths, Radiuses} from '@constants/numbers';
import {FlexAlignments, FlexDirections} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {
  getFormattedCurrency,
  getMoneyInHandFromSocietyInfo,
  getReceivablesFromSocietyInfo,
} from '@utils';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

const SocietyInfoCard = props => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {societyInfo} = props;

  return (
    <View
      style={[
        {
          backgroundColor: colors.primary,
          width: CommonWidths.fullParent,
          borderRadius: Radiuses.normal,
        },
        CommonStyles.normalPadding,
        CommonStyles.bigMarginBottom,
      ]}>
      <View
        style={[
          {
            flexDirection: FlexDirections.row,
            justifyContent: FlexAlignments.spaceBetween,
          },
        ]}>
        {/* Left */}
        <View
          style={[
            CommonStyles.fullFlex,
            {
              borderColor: colors.primaryLight,
              borderRightWidth: BorderWidths.normal,
            },
          ]}>
          <Text style={[{color: colors.light}, TypographyStyles.caption1]}>
            {t('Money in hand')}
          </Text>
          <Text style={[{color: colors.light}, TypographyStyles.title1]}>
            {getFormattedCurrency(getMoneyInHandFromSocietyInfo(societyInfo))}
          </Text>
        </View>
        {/* Right */}
        <View
          style={[CommonStyles.fullFlex, {alignItems: FlexAlignments.flexEnd}]}>
          <Text style={[{color: colors.light}, TypographyStyles.caption1]}>
            {t('Receivables')}
          </Text>
          <Text style={[{color: colors.light}, TypographyStyles.title1]}>
            {getFormattedCurrency(getReceivablesFromSocietyInfo(societyInfo))}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SocietyInfoCard;
