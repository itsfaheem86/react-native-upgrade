import {PropTypes} from '@constants/imports';
import {IconSizes, Paddings} from '@constants/numbers';
import {BackgroundColorTypes, CommonVariableTypes} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {ActivityIndicator} from 'react-native-paper';
import styles from './styles';

export default function NetworkIconButton(props) {
  const {
    onPress,
    iconName,
    iconStyle,
    disabled,
    iconType,
    loading,
    label,
    buttonStyle,
    indicatorStyle,
    indicatorColor,
  } = props;
  const {colors} = useTheme();
  const isLabelString = typeof label === CommonVariableTypes.string;
  return (
    <Button
      disabled={disabled}
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabledStyle={[{backgroundColor: BackgroundColorTypes.transparent}]}
      handleOffline>
      {loading ? (
        <ActivityIndicator
          style={[{padding: Paddings.small}, indicatorStyle]}
          size={IconSizes.small}
          color={indicatorColor ?? colors.primaryLight}
        />
      ) : (
        <Icon
          style={[{color: colors.primary}, iconStyle]}
          name={iconName}
          type={iconType}
          size={IconSizes.normal}
        />
      )}
      {isLabelString ? (
        <Text style={[TypographyStyles.body1, {color: colors.light}]}>
          {label}
        </Text>
      ) : (
        label
      )}
    </Button>
  );
}

NetworkIconButton.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  indicatorColor: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  indicatorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
