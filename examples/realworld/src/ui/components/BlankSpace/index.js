import {CommonStyles} from '@config/styles';
import {FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {View} from 'react-native';

const BlankSpace = () => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        CommonStyles.fullFlex,
        {
          backgroundColor: colors.background,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
        },
      ]}
    />
  );
};

export default BlankSpace;
