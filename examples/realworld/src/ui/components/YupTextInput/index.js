import TextInput from '@ui/atoms/TextInput';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';

function YupTextInput(props) {
  const {
    control,
    name,
    placeholder,
    secureTextEntry,
    keyboardType,
    errors,
    containerStyle,
  } = props;
  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => {
        return (
          <TextInput
            containerStyle={containerStyle}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            valid={!errors?.[name]}
            errorMessage={errors?.[name]?.message}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
          />
        );
      }}
      name={name}
    />
  );
}
YupTextInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  errors: PropTypes.object,
};

export default YupTextInput;
