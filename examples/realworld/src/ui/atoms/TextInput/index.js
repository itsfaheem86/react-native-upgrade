import {CommonStyles} from '@config/styles';
import {IconSizes} from '@constants/numbers';
import {IconNames} from '@constants/strings';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import IconButton from '@ui/components/IconButton';
import {capitalize} from 'lodash';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {TextInput as RnTextInput, View} from 'react-native';
import Text from '../Text';
import styles from './styles';

function TextInput(props) {
  const {
    placeholder,
    secureTextEntry,
    keyboardType,
    editable,
    onChangeText,
    onChange,
    onSubmitEditing,
    value,
    containerStyle,
    wrapperStyle,
    textInputStyle,
    onBlur,
    textRef,
    maxLength,
    onKeyPress,
    valid = true,
    errorMessage,
    onFocus,
    multiline,
    caretHidden,
  } = props;

  const {colors} = useTheme();
  const [secure, setSecure] = useState(secureTextEntry);

  const toggleSecure = () => {
    setSecure(prevValue => !prevValue);
  };

  return (
    <View style={[containerStyle]}>
      <View
        style={[
          styles.container,
          CommonStyles.normalRadius,
          {borderColor: colors.primary, backgroundColor: colors.card},
          CommonStyles.normalBorderWidth,
          !valid && {borderColor: colors.error},
          wrapperStyle,
        ]}>
        <RnTextInput
          multiline={multiline}
          ref={textRef}
          style={[
            styles.textInput,
            CommonStyles.bigPaddingLeft,
            {color: colors.text},
            textInputStyle,
          ]}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={CommonColors.gray}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          editable={editable}
          onChange={onChange}
          value={value}
          onChangeText={
            onChangeText ? text => onChangeText?.(text) : onChangeText
          }
          onKeyPress={onKeyPress}
          onSubmitEditing={onSubmitEditing}
          maxLength={maxLength}
          onFocus={onFocus}
          caretHidden={caretHidden}
        />
        {secureTextEntry && (
          <View style={[styles.iconContainer]}>
            {secure ? (
              <IconButton
                iconStyle={[{fontSize: IconSizes.normal}]}
                onPress={toggleSecure}
                iconName={IconNames.eye}
              />
            ) : (
              <IconButton
                iconStyle={[{fontSize: IconSizes.normal}]}
                onPress={toggleSecure}
                iconName={IconNames.eyeSlash}
              />
            )}
          </View>
        )}
      </View>
      {!!errorMessage && (
        <Text style={[TypographyStyles.caption1, {color: colors.error}]}>
          {capitalize(errorMessage)}
        </Text>
      )}
    </View>
  );
}
TextInput.propTypes = {
  textRef: PropTypes.object,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  valid: PropTypes.bool,
  keyboardType: PropTypes.string,
  errorMessage: PropTypes.string,
  editable: PropTypes.bool,
  caretHidden: PropTypes.bool,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  wrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textInputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxLength: PropTypes.number,
};

export default TextInput;
