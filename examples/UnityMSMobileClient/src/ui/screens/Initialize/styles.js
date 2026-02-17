import {CommonNumbers} from '@constants/numbers';
import {FlexAlignments} from '@constants/strings';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: CommonNumbers.one,
    justifyContent: FlexAlignments.center,
    alignItems: FlexAlignments.center,
  },
});
