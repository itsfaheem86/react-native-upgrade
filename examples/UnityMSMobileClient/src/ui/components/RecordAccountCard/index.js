import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonHeights,
  CommonNumbers,
  CommonWidths,
  IconSizes,
  Paddings,
  Radiuses,
} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  IconNames,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import {getArrearsFromAccount, getFormattedCurrency} from '@utils';
import {useIsDarkMode} from '@utils/hooks';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import IconButton from '../IconButton';

const RecordAccountCard = props => {
  const {record} = props;
  const {account, navigation} = props;
  const {member} = account;
  const {colors} = useTheme();
  const isDarkMode = useIsDarkMode();

  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  const isMember = userType === UserTypes.Member;
  const userId = auth?.[UserKeys._id];

  const accountId = account?._id;
  const societyId = isMember ? defaultAccount?.society?._id : userId;
  const isSameUser = userId === member?._id;

  console.log({component: RecordAccountCard.name, accountId, societyId});

  return (
    <Button
      style={[
        {
          flexDirection: FlexDirections.row,
          justifyContent: FlexAlignments.spaceBetween,
          alignItems: FlexAlignments.center,
          backgroundColor: colors.card,
          borderRadius: Radiuses.normal,
          padding: Paddings.small,
          elevation: CommonNumbers.one,
          borderColor: CommonColors.divider,
        },
        CommonStyles.normalPaddingHorizontal,
        !isDarkMode && CommonStyles.normalBorderWidth,
      ]}
      onPress={() => {
        navigation.navigate(RouteNames.MemberInfo, {
          accountId: accountId,
          societyId: societyId,
        });
      }}
      handleOffline
      disabled={isSameUser}
      disabledStyle={[
        {
          backgroundColor: colors.card2,
        },
        CommonStyles.removeBorderWidth,
      ]}>
      {/* Image */}
      <View
        style={[
          {
            width: CommonWidths.cardImage,
            height: CommonHeights.cardImage,
            alignItems: FlexAlignments.center,
            justifyContent: FlexAlignments.center,
          },
        ]}>
        <Avatar imageUri={member?.avatar} label={member?.name} />
      </View>
      {/* Name and info */}
      <View
        style={[
          CommonStyles.fullFlex,
          CommonStyles.normalPaddingHorizontal,
          CommonStyles.smallMarginLeft,
        ]}>
        <Text>{member?.name}</Text>
        <Text
          style={[TypographyStyles.caption1, CommonStyles.smallMarginRight]}>
          {getFormattedCurrency(getArrearsFromAccount(account))}
        </Text>
      </View>
      {!isMember && (
        <IconButton
          iconStyle={[{fontSize: IconSizes.normal}]}
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
              accountId: account?._id,
            });
          }}
          iconName={IconNames.minusCircle}
        />
      )}
    </Button>
  );
};

RecordAccountCard.propTypes = {
  account: PropTypes.object,
};

export default RecordAccountCard;
