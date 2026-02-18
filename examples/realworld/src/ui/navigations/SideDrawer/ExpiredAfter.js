import {CommonNumbers} from '@constants/numbers';
import {
  DateFormats,
  DisplayTypes,
  FlexDirections,
  UserKeys,
} from '@constants/strings';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import moment from 'moment';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const ExpiredAfter = () => {
  const auth = useSelector(state => state?.auth);
  const expiredAfter = auth[UserKeys.expiredAfter];
  // const remainingTime = useRemainingTime(expiredAfter);
  return (
    !!expiredAfter && (
      <View
        style={[
          {
            display: DisplayTypes.flex,
            flexDirection: FlexDirections.row,
          },
        ]}>
        <Text
          style={[TypographyStyles.caption2]}
          numberOfLines={CommonNumbers.one}>
          {moment().add(expiredAfter).format(DateFormats.dateTime)}
        </Text>
      </View>
    )
  );
};

export default ExpiredAfter;
