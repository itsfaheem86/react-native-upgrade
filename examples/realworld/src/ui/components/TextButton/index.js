import {PropTypes} from '@constants/imports';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import styles from './styles';

export default function TextButton(props) {
  const {onPress, text, textStyle, buttonStyle} = props;
  return (
    <Button style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[textStyle]}>{text}</Text>
    </Button>
  );
}

TextButton.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
