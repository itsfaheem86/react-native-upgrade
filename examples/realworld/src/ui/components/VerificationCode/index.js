import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  BorderWidths,
  CommonNumbers,
  ValidationNumbers,
} from '@constants/numbers';
import {CommonStrings, KeyboardTypes} from '@constants/strings';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import TextInput from '@ui/atoms/TextInput';
import {bracket} from '@utils';
import {Fragment, useEffect, useRef} from 'react';
import {View} from 'react-native';
import styles from './styles';

// Need to decide code length
// Pasting code only fill 1 code right now
export default function VerificationCode(props) {
  const {
    containerStyle,
    onChange,
    verificationCode,
    valid = true,
    onBlur,
    codeLength = ValidationNumbers.resetPasswordOTPLength,
  } = props;
  const codeInputs = new Array(codeLength).fill(CommonNumbers.zero);
  const {colors} = useTheme();
  const codeCharRefs = useRef(
    codeInputs?.map(_ => {
      return useRef(null);
    }),
  );
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (codeInputRef.current && bracket(verificationCode?.length)) {
      codeInputRef.current?.setNativeProps?.({
        selection: {
          start: verificationCode?.length,
          end: verificationCode?.length,
        },
      });
    }
  }, [verificationCode, codeInputRef.current]);

  return (
    <Fragment>
      <TextInput
        value={verificationCode}
        multiline
        textRef={codeInputRef}
        placeholder={CommonStrings.zero}
        onChangeText={onChange}
        wrapperStyle={[styles.hiddenInput]}
        maxLength={codeLength}
        keyboardType={KeyboardTypes.numeric}
        onBlur={onBlur}
      />
      <View style={[styles.textBoxContainer, containerStyle]}>
        {codeInputs?.map((_, index) => {
          let isActive = false;
          if (!(verificationCode?.length || index)) {
            isActive = true;
          } else if (
            bracket(verificationCode?.length < codeLength) &&
            bracket(verificationCode?.length === index)
          ) {
            isActive = true;
          } else if (
            bracket(verificationCode?.length === codeLength) &&
            bracket(index + CommonNumbers.one === codeLength)
          ) {
            isActive = true;
          }
          return (
            <TextInput
              key={index}
              value={verificationCode?.[index]}
              multiline // To prevent flicks and more ui/ux to edit the code
              textRef={codeCharRefs.current?.[index]}
              placeholder={CommonStrings.zero}
              onFocus={() => {
                codeInputRef.current?.focus?.();
              }}
              wrapperStyle={[
                isActive && {
                  borderWidth: BorderWidths.big,
                  borderColor: colors.primaryDark,
                },
              ]}
              containerStyle={[
                {
                  color: colors.text,
                  fontWeight: FontWeights.black,
                },
                styles.textBox,
                CommonStyles.normalRadius,
                TypographyStyles.body1,
              ]}
              maxLength={CommonNumbers.one}
              textInputStyle={[styles.textInput]}
              keyboardType={KeyboardTypes.numeric}
              caretHidden
              valid={valid}
            />
          );
        })}
      </View>
    </Fragment>
  );
}

VerificationCode.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func,
  valid: PropTypes.bool,
};
