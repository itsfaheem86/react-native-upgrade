import {PropTypes} from '@constants/imports';
import {IconSizes} from '@constants/numbers';
import {useTheme} from '@theme';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import styles from './styles';

export default function IconButton(props) {
  const {onPress, iconName, iconStyle, iconType, buttonStyle, handleOffline} =
    props;
  const {colors} = useTheme();

  return (
    <Button
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      handleOffline={handleOffline}>
      <Icon
        style={[{color: colors.primary}, iconStyle]}
        name={iconName}
        type={iconType}
        size={IconSizes.normal}
      />
    </Button>
  );
}

IconButton.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  handleOffline: PropTypes.bool,
};
