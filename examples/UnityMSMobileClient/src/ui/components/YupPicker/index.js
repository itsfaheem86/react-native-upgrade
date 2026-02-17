import {CommonStyles} from '@config/styles';
import {BorderWidths, IconSizes, zIndices} from '@constants/numbers';
import {
  BackgroundColorTypes,
  DropDownDirections,
  FlexAlignments,
  IconNames,
  IconTypes,
  KeyboardShouldPersistTypes,
  ListModeTypes,
  PickerModeTypes,
  TextAlignments,
} from '@constants/strings';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {capitalize, isEqual} from 'lodash';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// Force importing it
import RenderBadgeItem from 'react-native-dropdown-picker/src/components/RenderBadgeItem';

// If picker in the bottom, it's not scrolling as expected
function YupPicker(props) {
  const {
    control,
    name,
    errors,
    items,
    enabled = true,
    placeholder,
    searchPlaceholder,
    containerStyle,
    multiple,
    searchable,
    pickerModeType,
    zIndex = zIndices.first,
    initialSelected,
    listMode,
  } = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const errorMessage = errors?.[name]?.message;
  const valid = !errors?.[name];
  const [open, setOpen] = useState(false);
  // Dropdown setValue is a useState callback and it's not working as a normal callback
  // That's why I am using this external state to fix the bug
  const [stateValue, setStateValue] = useState();
  useEffect(() => {
    // setValue not working that's why this prop was created
    if (initialSelected) setStateValue(initialSelected);
  }, [initialSelected]);

  //  Need to look into it
  // https://stackoverflow.com/questions/69920418/react-hook-form-controller-component-does-not-acknowledge-react-native-dropdown
  // Unselect not working
  // Close on outside click
  // https://github.com/hossein-zare/react-native-dropdown-picker/issues/119
  return (
    <Controller
      control={control}
      render={({field: {onChange, onBlur, value}}) => {
        useEffect(() => {
          // Yup initial value should be assigned in first render that's why this one was created
          if (value) {
            console.log({component: YupPicker.name, value});
            setStateValue(value);
          }
        }, []);
        return (
          <View style={[containerStyle]}>
            <DropDownPicker
              style={[
                {
                  borderColor: enabled
                    ? valid
                      ? colors.primary
                      : colors.error
                    : CommonColors.gray,
                  backgroundColor: colors.card,
                },
              ]}
              zIndex={zIndex}
              disabled={!enabled}
              open={open}
              value={stateValue}
              items={items}
              setValue={setStateValue}
              setOpen={setOpen}
              onClose={onBlur}
              // https://stackoverflow.com/questions/70286155/react-native-dropdown-picker-scroll-inside-another-scroll-is-not-working
              listMode={listMode || ListModeTypes.SCROLLVIEW}
              dropDownDirection={DropDownDirections.BOTTOM}
              scrollViewProps={{
                keyboardShouldPersistTaps: KeyboardShouldPersistTypes.handled,
              }}
              dropDownContainerStyle={{
                borderWidth: BorderWidths.normal,
                borderColor: valid ? colors.primary : colors.error,
              }}
              listItemContainerStyle={{backgroundColor: colors.card}}
              listItemLabelStyle={{color: colors.text}}
              labelStyle={{color: colors.text}}
              TickIconComponent={_ => (
                <Icon
                  size={IconSizes.small}
                  type={IconTypes.MaterialIcons}
                  name={IconNames.check}
                  style={{color: colors.text}}
                />
              )}
              ListEmptyComponent={() => (
                <Text
                  style={[
                    {
                      textAlign: TextAlignments.center,
                      color: CommonColors.gray,
                      backgroundColor: colors.background,
                    },
                    CommonStyles.normalPadding,
                    TypographyStyles.body2,
                  ]}>
                  {t("There's nothing to show!")}
                </Text>
              )}
              modalContentContainerStyle={{backgroundColor: colors.background}}
              searchContainerStyle={{
                borderBottomColor: colors.primary,
                backgroundColor: colors.background,
              }}
              CloseIconComponent={({style}) => (
                <Icon
                  type={IconTypes.MaterialCommunityIcons}
                  name={IconNames.checkCircle}
                  style={[
                    style,
                    {
                      color: colors.primary,
                      textAlign: FlexAlignments.center,
                      backgroundColor: BackgroundColorTypes.transparent,
                    },
                  ]}
                  size={IconSizes.normal}
                />
              )}
              searchTextInputStyle={{
                borderColor: colors.primary,
                color: colors.text,
              }}
              searchPlaceholderTextColor={CommonColors.gray}
              ArrowDownIconComponent={({style}) => (
                <Icon
                  type={IconTypes.MaterialIcons}
                  name={IconNames.keyboardArrowDown}
                  style={[
                    style,
                    {
                      color: enabled
                        ? valid
                          ? colors.primary
                          : colors.error
                        : CommonColors.gray,
                    },
                  ]}
                  size={IconSizes.normal}
                />
              )}
              ArrowUpIconComponent={({style}) => (
                <Icon
                  type={IconTypes.MaterialIcons}
                  name={IconNames.keyboardArrowUp}
                  style={[
                    style,
                    {color: valid ? colors.primary : colors.error},
                  ]}
                  size={IconSizes.normal}
                />
              )}
              closeOnBackPressed
              placeholder={placeholder}
              placeholderStyle={{
                color: CommonColors.gray,
              }}
              renderBadgeItem={props => {
                // Currently I don't want user to accidentally
                // const onPress = enabled ? props.onPress : () => {};
                const onPress = () => {};
                return (
                  <RenderBadgeItem
                    {...props}
                    textStyle={{
                      color: colors.text,
                    }}
                    getBadgeColor={_ => colors.card2}
                    onPress={onPress}
                  />
                );
              }}
              searchPlaceholder={searchPlaceholder}
              onChangeValue={changeValue => {
                // Prevent infinite loop, Now it's not happening
                // But validation is triggering on first render if this condition removed
                if (!isEqual(value, changeValue) && changeValue) {
                  onChange(changeValue);
                }
              }}
              multiple={multiple}
              mode={pickerModeType ?? PickerModeTypes.simple}
              badgeDotColors={[colors.primary]}
              searchable={searchable}
            />
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
YupPicker.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  pickerModeType: PropTypes.string,
  zIndex: PropTypes.number,
  errors: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.object),
  initialSelected: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.bool,
  ]),
  listMode: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default YupPicker;
