import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonHeights,
  CommonIndices,
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
} from '@constants/strings';
import {
  useDeleteSocietyAccountMutation,
  useRequestSocietyAccountMutation,
} from '@graphql/actions/member/mutations';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DialogBox from '../DialogBox';
import NetworkIconButton from '../NetworkIconButton';

const SocietyCard = props => {
  const {society} = props;
  const {accounts} = society;
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [showDialog, setShowDialog] = useState(false);
  const [
    requestSocietyAccountMutation,
    {loading: isRequestSocietyAccountLoading},
  ] = useRequestSocietyAccountMutation();

  const [
    deleteSocietyAccountMutation,
    {loading: isDeleteSocietyAccountLoading},
  ] = useDeleteSocietyAccountMutation();

  console.log({component: SocietyCard.name, society});

  return (
    <Button
      style={[
        {
          flexDirection: FlexDirections.row,
          justifyContent: FlexAlignments.spaceBetween,
          alignItems: FlexAlignments.center,
          backgroundColor: colors.card2,
          borderRadius: Radiuses.normal,
          padding: Paddings.small,
          elevation: CommonNumbers.one,
        },
        CommonStyles.normalPaddingHorizontal,
      ]}
      disabled>
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
        <Avatar imageUri={society?.avatar} label={society?.name} />
      </View>
      {/* Name and info */}
      <View
        style={[
          CommonStyles.fullFlex,
          CommonStyles.normalPaddingHorizontal,
          CommonStyles.smallMarginLeft,
        ]}>
        <Text numberOfLines={CommonNumbers.one}>{society?.name}</Text>
        <View
          style={[
            {
              flexDirection: FlexDirections.row,
              alignItems: FlexAlignments.center,
            },
          ]}>
          <Text
            style={[TypographyStyles.caption1, CommonStyles.smallMarginRight]}>
            {society?.activeAccountsCount}
          </Text>
          <Icon name={IconNames.users} />
        </View>
      </View>
      {/* Actions */}
      <View>
        {accounts?.[CommonIndices.zero] ? (
          accounts?.[CommonIndices.zero]?.active ? (
            // Todo: Logic to leave the society
            <Icon
              style={[{color: CommonColors.green, fontSize: IconSizes.normal}]}
              type={IconTypes.Feather}
              name={IconNames.userCheck}
            />
          ) : (
            <NetworkIconButton
              onPress={() => setShowDialog(true)}
              loading={isDeleteSocietyAccountLoading}
              iconStyle={[{color: colors.error, fontSize: IconSizes.normal}]}
              iconType={IconTypes.Feather}
              iconName={IconNames.userMinus}
            />
          )
        ) : (
          <NetworkIconButton
            onPress={() => {
              requestSocietyAccountMutation({
                variables: {
                  requestSocietyAccountDto: {societyId: society?._id},
                },
              });
            }}
            loading={isRequestSocietyAccountLoading}
            iconStyle={[{color: colors.primary, fontSize: IconSizes.normal}]}
            iconType={IconTypes.Feather}
            iconName={IconNames.userPlus}
          />
        )}
      </View>
      <DialogBox
        showDialog={showDialog}
        onHideDialog={() => {
          setShowDialog(false);
        }}
        onRightPress={() => {
          deleteSocietyAccountMutation({
            variables: {
              // Can't access accountId that's why
              deleteSocietyAccountDto: {
                accountId: accounts?.[CommonIndices.zero]?._id,
              },
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

SocietyCard.propTypes = {
  society: PropTypes.object,
};

export default SocietyCard;
