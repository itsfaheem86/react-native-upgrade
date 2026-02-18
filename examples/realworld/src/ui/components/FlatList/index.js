import {EmptySvg} from '@assets/svgs';
import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonHeights,
  CommonNumbers,
  CommonWidths,
  Opacities,
} from '@constants/numbers';
import {FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {FlatList as RnFlatList, View} from 'react-native';
import BlankSpace from '../BlankSpace';

const FlatList = props => {
  const {
    emptyMessage,
    data,
    renderItem,
    ListHeaderComponent,
    contentContainerStyle,
    ...rest
  } = props;
  const {colors} = useTheme();

  return (
    <RnFlatList
      ListHeaderComponent={ListHeaderComponent}
      data={data}
      ItemSeparatorComponent={() => (
        <View style={[CommonStyles.bigMarginBottom]}></View>
      )}
      contentContainerStyle={[
        {flexGrow: CommonNumbers.one},
        contentContainerStyle,
      ]}
      ListEmptyComponent={() => {
        if (!emptyMessage) {
          return <BlankSpace />;
        }
        return (
          <View
            style={[
              CommonStyles.fullFlex,
              {
                justifyContent: FlexAlignments.center,
                alignItems: FlexAlignments.center,
              },
            ]}>
            <EmptySvg
              width={CommonWidths.emptyImage}
              height={CommonHeights.emptyImage}
              pathFill={colors.primaryDark}
            />
            <Text
              style={[
                TypographyStyles.body1,
                {color: colors.primaryDark, opacity: Opacities.half},
              ]}>
              {emptyMessage}
            </Text>
          </View>
        );
      }}
      renderItem={renderItem}
      {...rest}
    />
  );
};

FlatList.propTypes = {
  emptyMessage: PropTypes.string,
  data: PropTypes.array,
  contentContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default FlatList;
