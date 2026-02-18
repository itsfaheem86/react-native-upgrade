import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import VerificationCode from '../VerificationCode';

function YupVerificationCode(props) {
  const {control, name, errors, containerStyle} = props;
  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => {
        return (
          <VerificationCode
            verificationCode={value}
            containerStyle={containerStyle}
            onChange={onChange}
            onBlur={onBlur}
            // valid={!errors?.[name]}
          />
        );
      }}
      name={name}
    />
  );
}
YupVerificationCode.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

export default YupVerificationCode;
