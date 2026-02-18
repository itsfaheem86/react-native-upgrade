import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {IconSizes} from '@constants/numbers';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {showDefaultToast} from '@utils';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector} from 'react-redux';
import styles from './styles';

export default function NetworkButton(props) {
  const {
    children,
    onPress,
    style,
    loading,
    disabled,
    handleOffline = true,
    ...rest
  } = props;
  const {colors} = useTheme();

  const {t} = useTranslation();
  const isConnected = useSelector(state => state?.application?.isConnected);
  const onOfflineButtonClick = () => {
    showDefaultToast({message: t('Not connected')});
  };

  const finalOnPress =
    handleOffline && !isConnected ? onOfflineButtonClick : onPress;

  return (
    <TouchableOpacity
      onPress={finalOnPress}
      disabled={disabled}
      style={[
        styles.button,
        style,
        disabled && {backgroundColor: CommonColors.gray},
      ]}
      {...rest}>
      <View style={[CommonStyles.smallMarginRight]}>{children}</View>
      {loading && (
        <ActivityIndicator size={IconSizes.small} color={colors.primaryLight} />
      )}
    </TouchableOpacity>
  );
}

NetworkButton.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  handleOffline: PropTypes.bool,
};
