import {CommonStyles} from '@config/styles';
import {ValidationNumbers} from '@constants/numbers';
import {
  BookCategory,
  FlexAlignments,
  FlexDirections,
  IconNames,
  IconTypes,
  MomentUnitOfTimes,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {
  useDeleteSocietyCostRecordMutation,
  useDeleteSocietyCreditRecordMutation,
} from '@graphql/actions/book/mutations';
import {GET_SOCIETY_WITH_FULL_INFO_QUERY} from '@graphql/queries/society';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {FontWeights, TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import DialogBox from '@ui/components/DialogBox';
import IconButton from '@ui/components/IconButton';
import NetworkIconButton from '@ui/components/NetworkIconButton';
import {
  getFormattedCurrency,
  getFormattedDate,
  getMultipliedByString,
  showDefaultToast,
} from '@utils';
import {useIsDarkMode} from '@utils/hooks';
import moment from 'moment';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import {useSelector} from 'react-redux';
import styles from '../styles';

const SocietyRecordCard = props => {
  const {navigation, record} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const auth = useSelector(state => state.auth);
  const userType = auth[UserKeys.userType];
  const isMember = userType === UserTypes.Member;
  const recordCreatedAt = moment(record?.createdAt);
  const createdAtDifferenceFromNow = moment().diff(
    recordCreatedAt,
    MomentUnitOfTimes.days,
  );
  const canMutate =
    createdAtDifferenceFromNow < ValidationNumbers.maxUpdateAllowedDays;
  const [
    deleteSocietyCreditRecordMutation,
    {loading: isDeleteSocietyCreditRecordLoading},
  ] = useDeleteSocietyCreditRecordMutation();

  const [
    deleteSocietyCostRecordMutation,
    {loading: isDeleteSocietyCostRecordLoading},
  ] = useDeleteSocietyCostRecordMutation();

  const onRecordDelete = () => {
    if (record?.category === BookCategory.credit) {
      deleteSocietyCreditRecordMutation({
        variables: {
          deleteSocietyCreditRecordDto: {
            recordId: record?._id,
          },
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    } else if (record?.category === BookCategory.cost) {
      deleteSocietyCostRecordMutation({
        variables: {
          deleteSocietyCostRecordDto: {
            recordId: record?._id,
          },
        },
        refetchQueries: [GET_SOCIETY_WITH_FULL_INFO_QUERY],
      });
    }
  };

  const isDarkMode = useIsDarkMode();

  return (
    <Button
      style={[
        styles.defaultRecordCard,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        {
          backgroundColor: colors.card,
          borderColor: CommonColors.divider,
        },
        !isDarkMode && CommonStyles.normalBorderWidth,
      ]}
      onPress={() => {
        if (record?.accountsCount) {
          navigation.navigate(RouteNames.RecordAccounts, {
            recordId: record?._id,
          });
        } else {
          showDefaultToast({message: t('No accounts')});
        }
      }}
      handleOffline
      disabled={!record?.accountsCount}
      disabledStyle={[
        {
          backgroundColor: colors.card2,
        },
        CommonStyles.removeBorderWidth,
      ]}>
      <View style={[CommonStyles.fullFlex]}>
        <View
          style={[
            {
              flexDirection: FlexDirections.row,
              alignItems: FlexAlignments.center,
            },
            CommonStyles.smallMarginBottom,
          ]}>
          <Text style={[{fontWeight: FontWeights.medium}]}>
            {getFormattedCurrency(record?.amount)}
          </Text>
          {!!record?.accountsCount && (
            <View style={[{flexDirection: FlexDirections.row}]}>
              <Text
                style={[
                  TypographyStyles.caption1,
                  CommonStyles.smallMarginLeft,
                  {color: colors.primary, fontWeight: FontWeights.medium},
                ]}>
                {getMultipliedByString(record?.accountsCount)}
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
            {getFormattedDate(record?.date)}
          </Text>
        </View>
        <View
          style={[
            {
              flexDirection: FlexDirections.column,
              alignItems: FlexAlignments.flexStart,
            },
          ]}>
          {!!record?.description && (
            <Text
              style={[
                TypographyStyles.caption1,
                CommonStyles.smallPaddingRight,
              ]}>
              {record?.description}
            </Text>
          )}
          <View style={[CommonStyles.smallMarginTop]}>
            <Badge
              style={[
                {
                  backgroundColor:
                    record?.category === BookCategory.credit
                      ? colors.primary
                      : colors.error,
                  fontWeight: FontWeights.medium,
                  color: colors.light,
                },
              ]}>
              {record?.type?.name}
            </Badge>
          </View>
        </View>
      </View>
      {!isMember && canMutate && (
        <View style={[{flexDirection: FlexDirections.row}]}>
          <NetworkIconButton
            iconStyle={[{color: colors.error}]}
            buttonStyle={[CommonStyles.bigMarginRight]}
            iconType={IconTypes.MaterialCommunityIcons}
            iconName={IconNames.delete}
            loading={
              isDeleteSocietyCreditRecordLoading ||
              isDeleteSocietyCostRecordLoading
            }
            onPress={() => setShowDialog(true)}
          />
          <IconButton
            iconType={IconTypes.EntypoIcon}
            iconName={IconNames.edit}
            onPress={() => {
              navigation.navigate(RouteNames.CreateOrEditRecord, {record});
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
        onRightPress={onRecordDelete}
        rightTextStyle={{color: colors.error}}
        title={t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Do you really wanna delete this record?')}
        </Text>
      </DialogBox>
    </Button>
  );
};

export default SocietyRecordCard;
