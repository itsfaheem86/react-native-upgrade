import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {KeyboardShouldPersistTypes} from '@constants/strings';
import {RefreshControl, useWindowDimensions, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';

// Why
// 1. Can't create flat list inside tab view default container which is a scrollview
// 2. I have don't normal flat list container before but it doesn't support pull to refresh eg. FlatList -> FlatList with pull to refresh not working
// Need to study why the above scenario not working, For now I am going with the flow
// 3. That's why I created this flat list container which we should use if we need to all pull to refresh and flat list item inside tab view
const NetworkVirtualizedTabScrollView = props => {
  const {children, refreshing, onRefresh, style} = props;
  const windowHeight = useWindowDimensions().height;

  return (
    <Tabs.FlatList
      data={[{}]}
      style={[style]}
      ListFooterComponent={
        <View style={[CommonStyles.scrollViewBottomSpace]}></View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      keyboardShouldPersistTaps={KeyboardShouldPersistTypes.handled}
      refreshing={refreshing}
      // For more user friendly ui, when keyboard is opened
      contentContainerStyle={[{minHeight: windowHeight}]}
      nestedScrollEnabled
      renderItem={_ => children}
    />
  );
};

NetworkVirtualizedTabScrollView.propTypes = {
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default NetworkVirtualizedTabScrollView;
