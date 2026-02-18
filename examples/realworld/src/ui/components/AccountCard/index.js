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
  IconTypes,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {
  useDeleteSocietyAccountMutation,
  useUnblockSocietyAccountMutation,
} from '@graphql/actions/member/mutations';
import {useAcceptSocietyAccountMutation} from '@graphql/actions/society/mutations';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {
  getArrearsFromAccount,
  getFormattedCurrency,
  getFormattedDateTime,
} from '@utils';
import {useIsDarkMode} from '@utils/hooks';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import DialogBox from '../DialogBox';
import IconButton from '../IconButton';
import NetworkIconButton from '../NetworkIconButton';

const AccountCard = props => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {
    account,
    navigation,
    isCapturing,
    onAvatarLoadEnd,
    onAvatarError,
    accountCardStyle,
    hideSensitiveInfo,
  } = props;
  const {member, _id, active, blocked} = account;
  const auth = useSelector(state => state?.auth);
  const [showConfirmDeleteSocietyDialog, setShowConfirmDeleteSocietyDialog] =
    useState(false);

  // If same user disable actions
  const userId = auth?.[UserKeys._id];
  const userType = auth?.[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];

  const isSameUser = userId === member?._id;
  const isMember = userType === UserTypes.Member;

  // Need to send society id to backend
  const societyId =
    userType === UserTypes.Society ? userId : defaultAccount?.society?._id;

  const [
    acceptSocietyAccountMutation,
    {loading: isAcceptSocietyAccountLoading},
  ] = useAcceptSocietyAccountMutation();

  const [
    deleteSocietyAccountMutation,
    {loading: isDeleteSocietyAccountLoading},
  ] = useDeleteSocietyAccountMutation();

  const [
    unblockSocietyAccountMutation,
    {loading: isUnblockSocietyAccountLoading},
  ] = useUnblockSocietyAccountMutation(societyId);

  const isDarkMode = useIsDarkMode();

  const isDeletable = !(
    account?.paid ||
    account?.cost?.total ||
    account?.credit?.total
  );

  let canNavigate = false;
  if (isSameUser) {
    canNavigate = false;
  } else if (active || blocked) {
    canNavigate = true;
  }

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
          backgroundColor: canNavigate ? colors.card : colors.card2,
          borderColor: CommonColors.divider,
        },
        !isDarkMode && canNavigate && CommonStyles.normalBorderWidth,
        CommonStyles.normalPaddingHorizontal,
        accountCardStyle,
      ]}
      disabledStyle={false}
      disabled={!canNavigate}
      onPress={() => {
        navigation.navigate(RouteNames.MemberInfo, {
          accountId: _id,
          societyId: societyId,
        });
      }}
      handleOffline>
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
        <Avatar
          onAvatarLoadEnd={onAvatarLoadEnd}
          imageUri={member?.avatar}
          label={member?.name}
          onAvatarError={onAvatarError}
        />
      </View>
      {/* Name and info */}
      <View
        style={[
          CommonStyles.fullFlex,
          CommonStyles.normalPaddingHorizontal,
          CommonStyles.smallMarginLeft,
        ]}>
        <View
          style={[
            {
              flexDirection: FlexDirections.column,
              alignItems: FlexAlignments.flexStart,
            },
          ]}>
          <Text
            style={[CommonStyles.normalMarginRight]}
            numberOfLines={CommonNumbers.one}>
            {member?.name}
          </Text>
          {!!member?.lastSeen &&
            !isMember &&
            !isCapturing &&
            !hideSensitiveInfo && (
              <View
                style={[
                  {
                    flexDirection: FlexDirections.row,
                    alignItems: FlexAlignments.center,
                  },
                ]}>
                <Icon
                  name={IconNames.time}
                  type={IconTypes.Ionicons}
                  style={[
                    {
                      color: CommonColors.orange,
                    },
                  ]}
                />
                <Text
                  style={[
                    {color: colors.accent},
                    TypographyStyles.caption2,
                    CommonStyles.smallMarginLeft,
                  ]}>
                  {getFormattedDateTime(member?.lastSeen)}
                </Text>
              </View>
            )}
        </View>
        <Text
          style={[TypographyStyles.caption1, CommonStyles.smallMarginRight]}>
          {getFormattedCurrency(getArrearsFromAccount(account))}
        </Text>
      </View>

      {!isMember && !isCapturing && (
        <View
          style={[
            {
              flexDirection: FlexDirections.row,
            },
          ]}>
          {account?.active && (
            <>
              <IconButton
                iconStyle={[{fontSize: IconSizes.normal}]}
                onPress={() => {
                  navigation.navigate(RouteNames.CreateOrEditRecord, {
                    record: {
                      accounts: [account?._id],
                    },
                  });
                }}
                iconName={IconNames.plusCircle}
              />
              <IconButton
                iconStyle={[
                  {fontSize: IconSizes.normal, color: CommonColors.green},
                ]}
                onPress={() => {
                  navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
                    accountId: account?._id,
                  });
                }}
                iconName={IconNames.minusCircle}
                buttonStyle={[CommonStyles.bigMarginLeft]}
              />
            </>
          )}

          {isDeletable && !account?.blocked && (
            <NetworkIconButton
              onPress={() => setShowConfirmDeleteSocietyDialog(true)}
              loading={isDeleteSocietyAccountLoading}
              iconStyle={[{color: colors.error, fontSize: IconSizes.normal}]}
              iconType={IconTypes.Feather}
              iconName={IconNames.userMinus}
              buttonStyle={[CommonStyles.bigMarginLeft]}
            />
          )}
          {!account?.active && !account?.blocked && (
            <NetworkIconButton
              onPress={() => {
                acceptSocietyAccountMutation({
                  variables: {
                    acceptSocietyAccountDto: {
                      accountId: account?._id,
                    },
                  },
                });
              }}
              iconStyle={[
                {color: CommonColors.green, fontSize: IconSizes.normal},
              ]}
              buttonStyle={[CommonStyles.bigMarginLeft]}
              loading={isAcceptSocietyAccountLoading}
              iconType={IconTypes.Feather}
              iconName={IconNames.userCheck}
            />
          )}
          {!!account?.blocked && (
            <NetworkIconButton
              iconStyle={[
                {fontSize: IconSizes.normal, color: CommonColors.green},
              ]}
              buttonStyle={[CommonStyles.bigMarginLeft]}
              loading={isUnblockSocietyAccountLoading}
              iconType={IconTypes.MaterialCommunityIcons}
              iconName={IconNames.accountReactivate}
              onPress={() => {
                unblockSocietyAccountMutation({
                  variables: {
                    unblockSocietyAccountDto: {
                      accountId: account?._id,
                    },
                  },
                });
              }}
            />
          )}
        </View>
      )}
      <DialogBox
        showDialog={showConfirmDeleteSocietyDialog}
        onHideDialog={() => {
          setShowConfirmDeleteSocietyDialog(false);
        }}
        onRightPress={() => {
          deleteSocietyAccountMutation({
            variables: {
              deleteSocietyAccountDto: {accountId: account?._id},
            },
          });
        }}
        rightTextStyle={{color: colors.error}}
        title={t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Do you really wanna remove this account?')}
        </Text>
      </DialogBox>
    </Button>
  );
};

AccountCard.propTypes = {
  account: PropTypes.object,
};

export default AccountCard;
