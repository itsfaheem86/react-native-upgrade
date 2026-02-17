import {CommonNumbers} from '@constants/numbers';
import {FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  defaultAmountHistoryCard: {
    flexDirection: FlexDirections.column,
    // Need to check ios style
    elevation: CommonNumbers.one,
  },
});
