import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import PropTypes from 'prop-types';
import {Text as RnText} from 'react-native';

// Note: Thinking about using react-native-paper here
function Text(props) {
  const {colors} = useTheme();
  const {children, style, ...rest} = props;
  return (
    <RnText
      style={[{color: colors.text}, TypographyStyles.body1, style]}
      {...rest}>
      {children}
    </RnText>
  );
}

Text.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Text;
