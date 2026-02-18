import {PropTypes} from '@constants/imports';
import {CommonColors} from '@theme/colors/commonColors';
import {showDefaultToast} from '@utils';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

export default function Button(props) {
  const {
    children,
    onPress,
    style,
    disabled,
    disabledStyle,
    handleOffline,
    ...rest
  } = props;
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
        style,
        disabled &&
          !!disabledStyle && [
            {backgroundColor: CommonColors.gray},
            disabledStyle,
          ],
      ]}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
}

Button.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabledStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  handleOffline: PropTypes.bool,
};
