import {CommonStyles} from '@config/styles';
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

import {ValidationNumbers} from '@constants/numbers';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import IconButton from '@ui/components/IconButton';
import {getFormattedCurrency, getFormattedDate} from '@utils';
import moment from 'moment';
import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import {useSelector} from 'react-redux';
import styles from '../styles';

const MemberRecordCard = props => {
  const {navigation, record} = props;
  const {colors} = useTheme();

  const auth = useSelector(state => state?.auth);
  const userType = auth?.[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;

  const recordCreatedAt = moment(record?.createdAt);
  const createdAtDifferenceFromNow = moment().diff(
    recordCreatedAt,
    MomentUnitOfTimes.days,
  );
  const canMutate =
    createdAtDifferenceFromNow < ValidationNumbers.maxUpdateAllowedDays;

  return (
    <View
      style={[
        styles.defaultRecordCard,
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
            {getFormattedCurrency(record?.amount)}
          </Text>
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
      {isSociety && canMutate && (
        <IconButton
          iconType={IconTypes.EntypoIcon}
          iconName={IconNames.edit}
          onPress={() => {
            navigation.navigate(RouteNames.CreateOrEditRecord, {record});
          }}
          handleOffline
        />
      )}
    </View>
  );
};

export default MemberRecordCard;
