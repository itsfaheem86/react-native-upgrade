import {CommonHeights, CommonNumbers, CommonWidths} from '@constants/numbers';
import {FlexAlignments, FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    width: CommonWidths.fullParent,
    justifyContent: FlexAlignments.spaceBetween,
    flexDirection: FlexDirections.row,
  },
  iconContainer: {
    aspectRatio: CommonNumbers.one,
    alignItems: FlexAlignments.center,
    justifyContent: FlexAlignments.center,
  },
  textInput: {
    flex: CommonNumbers.one,
    height: CommonHeights.commonInput,
  },
});
