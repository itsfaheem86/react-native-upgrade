import {CommonStyles} from '@config/styles';
import {CommonHeights, CommonWidths, Radiuses} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  FlexWrapOptions,
  Themes,
} from '@constants/strings';
import {setTheme} from '@redux/slices/applicationSlice';
import {ThemeSupport, useTheme} from '@theme';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import DialogBox from '@ui/components/DialogBox';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

const ThemesPicker = props => {
  const {style} = props;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const {colors} = useTheme();
  const reduxTheme = useSelector(state => state.application.theme);
  const [selectedTheme, setSelectedTheme] = useState(reduxTheme?.name);
  const onSetTheme = name => {
    dispatch(setTheme({name}));
  };
  return (
    <Button
      style={[
        {
          width: CommonWidths.themePicker,
          height: CommonHeights.themePicker,
          borderRadius: Radiuses.themePicker,
          backgroundColor: colors.primary,
        },
        style,
      ]}
      onPress={() => {
        setShowDialog(!showDialog);
      }}>
      <DialogBox
        showDialog={showDialog}
        onHideDialog={() => {
          setShowDialog(false);
        }}
        onRightPress={() => {
          onSetTheme(selectedTheme);
        }}
        title={t('Themes')}
        rightText={t('Confirm')}>
        <View style={[CommonStyles.bigPaddingHorizontal]}>
          <Text style={[CommonStyles.bigMarginBottom]}>
            {t(
              'Select a theme that best suits your style and preferences for this application',
            )}
          </Text>
          <View
            style={[
              CommonStyles.smallMarginBottom,
              {
                flexDirection: FlexDirections.row,
                justifyContent: FlexAlignments.spaceBetween,
                flexWrap: FlexWrapOptions.wrap,
              },
            ]}>
            {Object.values(Themes).map(themeName => {
              const theme = ThemeSupport.find(t => t.theme === themeName);
              return (
                <Button
                  key={themeName}
                  onPress={() => {
                    setSelectedTheme(themeName);
                  }}
                  style={[
                    {
                      width: CommonWidths.themePicker,
                      height: CommonHeights.themePicker,
                      borderRadius: Radiuses.themePicker,
                      backgroundColor: theme.light.colors.primary,
                      borderColor: colors.accent,
                    },
                    selectedTheme === themeName && CommonStyles.bigBorderWidth,
                  ]}
                />
              );
            })}
          </View>
        </View>
      </DialogBox>
    </Button>
  );
};

export default ThemesPicker;
