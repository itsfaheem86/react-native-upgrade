import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonNumbers,
  CommonWidths,
  Radiuses,
  zIndices,
} from '@constants/numbers';
import {IconNames, Positions} from '@constants/strings';
import {useTheme} from '@theme';
import {FAB as RNPFAB} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FAB = props => {
  const {onPress, style} = props;
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <RNPFAB
      style={[
        {
          position: Positions.absolute,
          bottom: insets.bottom,
          right: CommonNumbers.zero,
          backgroundColor: colors.primary,
          borderRadius: Radiuses.fabButton,
          zIndex: zIndices.first,
        },
        CommonStyles.bigMargin,
        style,
      ]}
      customSize={CommonWidths.fabButton}
      onPress={onPress}
      icon={IconNames.plus}
      color={colors.light}
    />
  );
};

FAB.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default FAB;
