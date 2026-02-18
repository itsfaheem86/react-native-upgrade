import {CommonStyles} from '@config/styles';
import {CommonHeights} from '@constants/numbers';
import {useTheme} from '@theme';
import {CommonColors} from '@theme/colors/commonColors';
import {TypographyStyles} from '@typography';
import {Searchbar as RNPSearchBar} from 'react-native-paper';

const SearchBar = props => {
  const {placeholder, style, onChangeText} = props;
  const {colors} = useTheme();
  return (
    <RNPSearchBar
      style={[
        CommonStyles.normalRadius,
        CommonStyles.normalBorderWidth,
        {
          borderColor: colors.primary,
          backgroundColor: colors.card,
          height: CommonHeights.commonInput,
        },
        style,
      ]}
      iconColor={colors.primary}
      placeholder={placeholder}
      searchPlaceholderTextColor={CommonColors.gray}
      placeholderTextColor={CommonColors.gray}
      inputStyle={[TypographyStyles.body1]}
      onChangeText={onChangeText}
    />
  );
};

export default SearchBar;
