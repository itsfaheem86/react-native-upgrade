import {CommonHeights, CommonWidths, Radiuses} from '@constants/numbers';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  defaultAvatar: {
    width: CommonWidths.cardImage,
    height: CommonHeights.cardImage,
    borderRadius: Radiuses.cardImage,
  },
});
