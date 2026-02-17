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
import {FlexAlignments, FlexDirections, UserTypes} from '@constants/strings';

import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import {useIsDarkMode} from '@utils/hooks';
import {ActivityIndicator, View} from 'react-native';
import {Badge} from 'react-native-paper';

const UserCard = props => {
  const {user, onPress, loading, handleOffline} = props;
  const userType = user?.__typename;
  const {colors} = useTheme();
  const isDarkMode = useIsDarkMode();
  const isActive = user?.active;
  console.log({component: UserCard.name, user});
  return (
    <Button
      style={[
        {
          flexDirection: FlexDirections.row,
          justifyContent: FlexAlignments.spaceBetween,
          alignItems: FlexAlignments.center,
          borderRadius: Radiuses.normal,
          padding: Paddings.small,
          // Need to check ios style
          elevation: CommonNumbers.one,
          backgroundColor: !isActive ? colors.card : colors.card2,
          borderColor: CommonColors.divider,
        },
        !isDarkMode && !isActive && CommonStyles.normalBorderWidth,
        CommonStyles.normalPaddingHorizontal,
      ]}
      onPress={onPress}
      disabled={isActive}
      handleOffline={handleOffline}>
      <View
        style={[
          {
            width: CommonWidths.cardImage,
            height: CommonHeights.cardImage,
            alignItems: FlexAlignments.center,
            justifyContent: FlexAlignments.center,
          },
        ]}>
        <Avatar imageUri={user?.avatar} label={user?.name} />
      </View>
      <View
        style={[
          CommonStyles.fullFlex,
          CommonStyles.normalPaddingHorizontal,
          CommonStyles.smallMarginLeft,
        ]}>
        <Text numberOfLines={CommonNumbers.one}>{user?.name}</Text>

        <Text
          style={[TypographyStyles.caption1, CommonStyles.smallMarginRight]}>
          {user?.email}
        </Text>
        <View style={[CommonStyles.smallMarginTop]}>
          <Badge
            style={[
              {
                backgroundColor:
                  userType === UserTypes.Member
                    ? colors.primary
                    : CommonColors.red,
                fontWeight: FontWeights.medium,
                color: colors.light,
                alignSelf: FlexAlignments.flexStart,
              },
            ]}>
            {userType}
          </Badge>
        </View>
      </View>
      {loading && (
        <ActivityIndicator size={IconSizes.small} color={colors.primaryLight} />
      )}
    </Button>
  );
};

UserCard.propType = {
  onPress: PropTypes.func,
  user: PropTypes.object,
  loading: PropTypes.bool,
};

export default UserCard;
