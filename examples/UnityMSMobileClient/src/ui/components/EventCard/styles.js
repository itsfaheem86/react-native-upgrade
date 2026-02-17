import {CommonNumbers} from '@constants/numbers';
import {FlexAlignments, FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  defaultEventCard: {
    flexDirection: FlexDirections.row,
    justifyContent: FlexAlignments.center,
    alignItems: FlexAlignments.center,
    // Need to check ios style
    elevation: CommonNumbers.one,
  },
});
