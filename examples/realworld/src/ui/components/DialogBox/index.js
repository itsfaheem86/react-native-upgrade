import {PropTypes} from '@constants/imports';
import {ModelWidths} from '@constants/numbers';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import {useTranslation} from 'react-i18next';
import Modal, {
  ModalButton,
  ModalFooter,
  ModalTitle,
  ScaleAnimation,
} from 'react-native-modals';

const DialogBox = props => {
  const {t} = useTranslation();
  const {
    title,
    leftText,
    rightText,
    showDialog,
    onRightPress,
    onLeftPress,
    onHideDialog,
    children,
    disableRight,
    rightTextStyle,
    footer,
    onTouchOutside,
  } = props;

  const {colors} = useTheme();

  return (
    <Modal
      onTouchOutside={onTouchOutside ?? onHideDialog}
      width={ModelWidths.big}
      visible={showDialog}
      modalStyle={{backgroundColor: colors.card}}
      onSwipeOut={onHideDialog}
      modalAnimation={new ScaleAnimation()}
      onHardwareBackPress={() => {
        onHideDialog();
        return true;
      }}
      modalTitle={
        title && (
          <ModalTitle
            textStyle={{color: colors.text}}
            title={title}
            hasTitleBar={false}
          />
        )
      }
      footer={
        footer ?? (
          <ModalFooter>
            <ModalButton
              text={leftText ?? t('Cancel')}
              style={[TypographyStyles.body2]}
              bordered
              onPress={() => {
                onLeftPress?.();
                onHideDialog();
              }}
            />
            <ModalButton
              textStyle={[
                {
                  color: disableRight ? CommonColors.gray : CommonColors.green,
                },
                rightTextStyle,
              ]}
              text={rightText ?? t('Confirm')}
              bordered
              disabled={disableRight}
              onPress={async () => {
                onRightPress?.();
                onHideDialog();
              }}
            />
          </ModalFooter>
        )
      }>
      {children}
    </Modal>
  );
};

DialogBox.propTypes = {
  title: PropTypes.string,
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  showDialog: PropTypes.bool.isRequired,
  disableRight: PropTypes.bool,
  onHideDialog: PropTypes.func.isRequired,
  onLeftPress: PropTypes.func,
  onRightPress: PropTypes.func,
  onTouchOutside: PropTypes.func,
};

export default DialogBox;
