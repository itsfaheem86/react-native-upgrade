import {FlexAlignments, FlexDirections} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  rememberMeAndForgotPasswordContainer: {
    flexDirection: FlexDirections.row,
    alignItems: FlexAlignments.center,
    justifyContent: FlexAlignments.spaceBetween,
  },
  doesNotHaveAccountContainer: {
    flexDirection: FlexDirections.row,
    alignItems: FlexAlignments.center,
    justifyContent: FlexAlignments.center,
  },
});
