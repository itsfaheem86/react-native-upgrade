import {CommonHeights, CommonNumbers, CommonWidths} from '@constants/numbers';
import {FlexAlignments, FlexDirections} from '@constants/strings';
import {CommonColors} from '@theme/colors/commonColors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  textBoxContainer: {
    flexDirection: FlexDirections.row,
    justifyContent: FlexAlignments.spaceBetween,
  },
  textBox: {
    width: CommonWidths.charInput,
    height: CommonHeights.charInput,
    justifyContent: FlexAlignments.center,
    alignItems: FlexAlignments.center,
    textAlign: FlexAlignments.center,
  },
  hiddenInput: {
    width: CommonNumbers.zero,
    height: CommonNumbers.zero,
    borderWidth: CommonNumbers.zero,
    borderColor: CommonColors.transparent,
  },
  textInput: {
    textAlign: FlexAlignments.center,
    // Overriding textInput initial padding
    paddingLeft: CommonNumbers.zero,
  },
});
