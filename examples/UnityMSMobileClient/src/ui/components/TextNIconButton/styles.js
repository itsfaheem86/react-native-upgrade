import {FlexAlignments, FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  button: {
    flexDirection: FlexDirections.row,
    justifyContent: FlexAlignments.center,
    alignItems: FlexAlignments.center,
  },
});
