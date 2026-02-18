import {CommonIndices} from '@constants/numbers';
import {FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {capitalize} from 'lodash';
import PropTypes from 'prop-types';
import {Controller} from 'react-hook-form';
import {View} from 'react-native';
import ImagePicker from '../ImagePicker';

function YupImagePicker(props) {
  const {colors} = useTheme();
  const {control, name, errors, placeholder, upload, nestedValidation} = props;
  let errorMessage = errors?.[name]?.message;
  if (nestedValidation) {
    if (errors?.[name]) {
      errorMessage = Object.values(errors?.[name])?.[CommonIndices.zero]
        ?.message;
    }
  }
  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => {
        return (
          <View style={[{alignItems: FlexAlignments.center}]}>
            <ImagePicker
              onBlur={onBlur}
              imageUri={value?.uri}
              onImagePick={onChange}
              upload={upload}
            />
            {placeholder && (
              <Text style={[TypographyStyles.caption2]}>{placeholder}</Text>
            )}
            {!!errorMessage && (
              <Text style={[TypographyStyles.caption1, {color: colors.error}]}>
                {capitalize(errorMessage)}
              </Text>
            )}
          </View>
        );
      }}
      name={name}
    />
  );
}
YupImagePicker.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
  placeholder: PropTypes.string,
  upload: PropTypes.bool,
};

export default YupImagePicker;
