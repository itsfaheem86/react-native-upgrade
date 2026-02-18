import {ActivityIndicatorSizeTypes, FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {ActivityIndicator, View} from 'react-native';

const SubLoading = () => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
        },
      ]}>
      <ActivityIndicator
        color={colors.primaryLight}
        size={ActivityIndicatorSizeTypes.large}
      />
    </View>
  );
};

export default SubLoading;
