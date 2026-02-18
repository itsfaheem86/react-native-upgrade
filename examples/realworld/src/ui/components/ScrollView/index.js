import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {Paddings} from '@constants/numbers';
import {ScrollView as RNScrollView, View} from 'react-native';

const ScrollView = props => {
  const {children, ...rest} = props;
  return (
    <RNScrollView contentContainerStyle={[{padding: Paddings.big}]} {...rest}>
      {children}
      <View style={[CommonStyles.scrollViewBottomSpace]}></View>
    </RNScrollView>
  );
};

ScrollView.propTypes = {
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default ScrollView;
