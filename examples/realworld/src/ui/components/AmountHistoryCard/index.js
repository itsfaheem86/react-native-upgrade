import {CommonStyles} from '@config/styles';
import {ValidationNumbers} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  IconNames,
  IconTypes,
  MomentUnitOfTimes,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useDeleteMemberAmountHistoryMutation} from '@graphql/actions/book/mutations';
import {
  GET_SOCIETY_ACCOUNTS_QUERY,
  GET_SOCIETY_WITH_FULL_INFO_QUERY,
} from '@graphql/queries/society';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import DialogBox from '@ui/components/DialogBox';
import {getFormattedCurrency, getFormattedDate} from '@utils';
import moment from 'moment';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import IconButton from '../IconButton';
import NetworkIconButton from '../NetworkIconButton';
import styles from './styles';

const AmountHistoryCard = props => {
  const {navigation, amountHistory, accountId, societyId} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const auth = useSelector(state => state.auth);
  const userType = auth[UserKeys.userType];
  const isMember = userType === UserTypes.Member;

  const amountHistoryCreatedAt = moment(amountHistory?.createdAt);
  const createdAtDifferenceFromNow = moment().diff(
    amountHistoryCreatedAt,
    MomentUnitOfTimes.days,
  );
  const canMutate =
    createdAtDifferenceFromNow < ValidationNumbers.maxUpdateAllowedDays;

  const [
    deleteMemberAmountHistoryMutation,
    {loading: isDeleteMemberAmountHistoryLoading},
  ] = useDeleteMemberAmountHistoryMutation({accountId});

  const onAmountHistoryDelete = () => {
    deleteMemberAmountHistoryMutation({
      variables: {
        deleteMemberAmountHistoryDto: {
          amountHistoryId: amountHistory?._id,
        },
      },
      refetchQueries: [
        GET_SOCIETY_WITH_FULL_INFO_QUERY,
        {
          query: GET_SOCIETY_ACCOUNTS_QUERY,
          variables: {
            getSocietyAccountsDto: {
              societyId,
            },
          },
        },
      ],
    });
  };

  return (
    <View
      style={[
        styles.defaultAmountHistoryCard,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        {
          backgroundColor: colors.card2,
        },
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
            {getFormattedCurrency(amountHistory?.amount)}
          </Text>
          <Text
            style={[
              {color: colors.accent},
              TypographyStyles.caption2,
              CommonStyles.normalMarginLeft,
            ]}>
            {getFormattedDate(amountHistory?.date)}
          </Text>
        </View>
        {!!amountHistory?.description && (
          <Text
            style={[TypographyStyles.caption1, CommonStyles.smallPaddingRight]}>
            {amountHistory?.description}
          </Text>
        )}
      </View>
      {!isMember && canMutate && (
        <View style={[{flexDirection: FlexDirections.row}]}>
          <NetworkIconButton
            iconStyle={[{color: colors.error}]}
            buttonStyle={[CommonStyles.bigMarginRight]}
            iconType={IconTypes.MaterialCommunityIcons}
            iconName={IconNames.delete}
            loading={isDeleteMemberAmountHistoryLoading}
            onPress={() => setShowDialog(true)}
          />
          <IconButton
            iconType={IconTypes.EntypoIcon}
            iconName={IconNames.edit}
            onPress={() => {
              navigation.navigate(RouteNames.CreateOrEditPaidAmount, {
                amountHistory,
                accountId,
              });
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
        onRightPress={onAmountHistoryDelete}
        rightTextStyle={{color: colors.error}}
        title={t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Do you really wanna delete this amount history?')}
        </Text>
      </DialogBox>
    </View>
  );
};

export default AmountHistoryCard;
