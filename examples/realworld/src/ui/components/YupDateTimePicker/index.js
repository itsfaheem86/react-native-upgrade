import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {capitalize} from 'lodash';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import DateTimePicker from '../DateTimePicker';

function YupDateTimePicker(props) {
  const {colors} = useTheme();
  const {control, name, minimumDate, maximumDate, errors} = props;
  const errorMessage = errors?.[name]?.message;
  return (
    <Controller
      control={control}
      render={({field: {onChange, value}}) => {
        return (
          <>
            <DateTimePicker
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onDateTimeChange={onChange}
              dateTime={value}
              valid={!errors?.[name]}
            />
            {!!errorMessage && (
              <Text style={[TypographyStyles.caption1, {color: colors.error}]}>
                {capitalize(errorMessage)}
              </Text>
            )}
          </>
        );
      }}
      name={name}
    />
  );
}
YupDateTimePicker.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

export default YupDateTimePicker;
