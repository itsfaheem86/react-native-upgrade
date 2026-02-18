import {CommonHeights, CommonWidths, Radiuses} from '@constants/numbers';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  image: {
    width: CommonWidths.imagePicker,
    height: CommonHeights.imagePicker,
    borderRadius: Radiuses.imagePicker,
  },
});
