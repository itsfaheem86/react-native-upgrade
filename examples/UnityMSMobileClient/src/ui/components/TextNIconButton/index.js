import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import styles from './styles';

export default function TextNIconButton(props) {
  const {onPress, iconName, text, buttonStyle} = props;
  const {colors} = useTheme();
  return (
    <Button
      onPress={onPress}
      style={[
        {backgroundColor: colors.primary},
        styles.button,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        buttonStyle,
      ]}>
      <Icon
        style={[{color: colors.text}, TypographyStyles.body1]}
        name={iconName}
      />
      <Text
        style={[
          {
            color: colors.text,
          },
          TypographyStyles.body1,
          CommonStyles.normalMarginLeft,
        ]}>
        {text}
      </Text>
    </Button>
  );
}

TextNIconButton.propTypes = {
  onPress: PropTypes.func,
  iconName: PropTypes.string,
  text: PropTypes.string,
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
