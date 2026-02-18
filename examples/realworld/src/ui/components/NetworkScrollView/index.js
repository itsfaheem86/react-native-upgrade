import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {Paddings} from '@constants/numbers';
import {RefreshControl, ScrollView, View} from 'react-native';

const NetworkScrollView = props => {
  const {children, refreshing, contentContainerStyle, onRefresh, ...rest} =
    props;
  return (
    <ScrollView
      contentContainerStyle={[{padding: Paddings.big}, contentContainerStyle]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...rest}>
      {children}
      <View style={[CommonStyles.scrollViewBottomSpace]}></View>
    </ScrollView>
  );
};

NetworkScrollView.propTypes = {
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default NetworkScrollView;
