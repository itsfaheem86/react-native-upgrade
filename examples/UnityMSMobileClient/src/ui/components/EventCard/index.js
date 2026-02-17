import {CommonStyles} from '@config/styles';
import {
  FlexAlignments,
  FlexDirections,
  IconNames,
  IconTypes,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';

import {useDeleteSocietyEventMutation} from '@graphql/actions/event/mutations';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import DialogBox from '@ui/components/DialogBox';
import {getFormattedDate, getMultipliedByString} from '@utils';
import {useIsDarkMode} from '@utils/hooks';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import {useSelector} from 'react-redux';
import IconButton from '../IconButton';
import NetworkIconButton from '../NetworkIconButton';
import styles from './styles';

const SocietyEventCard = props => {
  const {navigation, event} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const auth = useSelector(state => state.auth);
  const userType = auth[UserKeys.userType];
  const isMember = userType === UserTypes.Member;

  const [deleteSocietyEventMutation, {loading: isDeleteSocietyEventLoading}] =
    useDeleteSocietyEventMutation();

  const onEventDelete = () => {
    deleteSocietyEventMutation({
      variables: {
        deleteSocietyEventDto: {
          eventId: event?._id,
        },
      },
    });
  };

  const isDarkMode = useIsDarkMode();

  return (
    <Button
      style={[
        styles.defaultEventCard,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        {
          backgroundColor: colors.card,
          borderColor: CommonColors.divider,
        },
        !isDarkMode && CommonStyles.normalBorderWidth,
      ]}
      onPress={() => {
        navigation.navigate(RouteNames.EventAccounts, {
          eventId: event?._id,
        });
      }}
      disabled={!event?.accountsCount}
      disabledStyle={[
        {
          backgroundColor: colors.card2,
        },
        CommonStyles.removeBorderWidth,
      ]}
      handleOffline>
      <View style={[CommonStyles.fullFlex]}>
        <View
          style={[
            {
              flexDirection: FlexDirections.row,
              alignItems: FlexAlignments.center,
            },
            CommonStyles.smallMarginBottom,
          ]}>
          <Text style={[{fontWeight: FontWeights.medium}]}>{event?.title}</Text>
          {!!event?.accountsCount && (
            <View style={[{flexDirection: FlexDirections.row}]}>
              <Text
                style={[
                  TypographyStyles.caption1,
                  CommonStyles.smallMarginLeft,
                  {color: colors.primary, fontWeight: FontWeights.medium},
                ]}>
                {getMultipliedByString(event?.accountsCount)}
                <Icon name={IconNames.users} />
              </Text>
            </View>
          )}
          <Text
            style={[
              {color: colors.accent},
              TypographyStyles.caption2,
              CommonStyles.normalMarginLeft,
            ]}>
            {getFormattedDate(event?.date)}
          </Text>
        </View>
        <View
          style={[
            {
              flexDirection: FlexDirections.column,
              alignItems: FlexAlignments.flexStart,
            },
          ]}>
          {!!event?.description && (
            <Text
              style={[
                TypographyStyles.caption1,
                CommonStyles.smallPaddingRight,
              ]}>
              {event?.description}
            </Text>
          )}
          <View style={[CommonStyles.smallMarginTop]}>
            <Badge
              style={[
                {
                  backgroundColor: colors.primary,
                  fontWeight: FontWeights.medium,
                  color: colors.light,
                },
              ]}>
              {event?.organizer?.member?.name}
            </Badge>
          </View>
        </View>
      </View>
      {!isMember && (
        <View style={[{flexDirection: FlexDirections.row}]}>
          <NetworkIconButton
            iconStyle={[{color: colors.error}]}
            buttonStyle={[CommonStyles.bigMarginRight]}
            iconType={IconTypes.MaterialCommunityIcons}
            iconName={IconNames.delete}
            loading={isDeleteSocietyEventLoading}
            onPress={() => setShowDialog(true)}
          />
          <IconButton
            iconType={IconTypes.EntypoIcon}
            iconName={IconNames.edit}
            onPress={() => {
              navigation.navigate(RouteNames.CreateOrEditEvent, {event});
            }}
            handleOffline
          />
        </View>
      )}
      <DialogBox
        showDialog={showDialog}
        onHideDialog={() => {
          setShowDialog(false);
        }}
        onRightPress={onEventDelete}
        rightTextStyle={{color: colors.error}}
        title={t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Do you really wanna delete this event?')}
        </Text>
      </DialogBox>
    </Button>
  );
};

export default SocietyEventCard;
