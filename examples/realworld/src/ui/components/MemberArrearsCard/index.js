import {CommonStyles} from '@config/styles';
import {CommonWidths, IconSizes, Radiuses} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  IconNames,
  IconTypes,
  RouteNames,
} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {getArrearsFromAccount, getFormattedCurrency} from '@utils';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import IconButton from '../IconButton';

// Title and language check done for forms in this component: Check 1
const MemberArrearsCard = props => {
  const {navigation, account, isSociety} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.primary,
          width: CommonWidths.fullParent,
          borderRadius: Radiuses.normal,
          flexDirection: FlexDirections.row,
          justifyContent: FlexAlignments.spaceBetween,
        },
        CommonStyles.normalPadding,
      ]}>
      <View style={[CommonStyles.fullFlex]}>
        <Text style={[{color: colors.light}, TypographyStyles.caption1]}>
          {t('Total arrears')}
        </Text>
        <Text style={[{color: colors.light}, TypographyStyles.title1]}>
          {getFormattedCurrency(getArrearsFromAccount(account))}
        </Text>
      </View>
      <View
        style={{
          alignItems: FlexAlignments.center,
          flexDirection: FlexDirections.row,
        }}>
        {isSociety && (
          <IconButton
            iconStyle={[
              {fontSize: IconSizes.normal, color: colors.primaryLight},
              CommonStyles.bigMarginRight,
            ]}
            onPress={() => {
              navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
                accountId: account?._id,
              });
            }}
            iconName={IconNames.minusCircle}
          />
        )}
        <IconButton
          iconStyle={[{fontSize: IconSizes.normal, color: colors.primaryLight}]}
          onPress={() => {
            navigation.navigate(RouteNames.PaidAccountAmountHistory, {
              accountId: account?._id,
            });
          }}
          iconName={IconNames.history}
        />
        <IconButton
          iconStyle={[
            {fontSize: IconSizes.normal, color: colors.primaryLight},
            CommonStyles.bigMarginLeft,
          ]}
          onPress={() => {
            navigation.navigate(RouteNames.MemberAnalytics, {
              accountId: account?._id,
            });
          }}
          iconType={IconTypes.MaterialCommunityIcons}
          iconName={IconNames.googleAnalytics}
        />
      </View>
    </View>
  );
};

export default MemberArrearsCard;
