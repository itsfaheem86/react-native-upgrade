import {CommonWidths} from '@constants/numbers';
import {FlexAlignments, FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: FlexDirections.row,
    alignItems: FlexAlignments.center,
  },
  dateContainer: {
    width: CommonWidths.oneByFour,
  },
});
