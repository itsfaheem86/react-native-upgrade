import {EmptySvg} from '@assets/svgs';
import {CommonStyles} from '@config/styles';
import {PropTypes} from '@constants/imports';
import {
  CommonDelays,
  CommonHeights,
  CommonNumbers,
  CommonWidths,
  Opacities,
} from '@constants/numbers';
import {ActivityIndicatorSizeTypes, FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  FlatList as RnFlatList,
  View,
} from 'react-native';
import BlankSpace from '../BlankSpace';
import SubLoading from '../SubLoading';

const NetworkFlatList = props => {
  const {
    emptyMessage,
    loading,
    data,
    refetch,
    renderItem,
    ListHeaderComponent,
    contentContainerStyle,
    onEndReached,
    isPageLoading = false,
    delay,
    ...rest
  } = props;
  const {colors} = useTheme();
  const [wait, setWait] = useState(delay);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted && wait) setWait(false);
    }, CommonDelays.small);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <RnFlatList
      ListFooterComponent={
        <>
          {isPageLoading && !loading && (
            <ActivityIndicator
              size={ActivityIndicatorSizeTypes.large}
              color={colors.primary}
            />
          )}
          <View style={[CommonStyles.scrollViewBottomSpace]}></View>
        </>
      }
      // We don't add loading cause we need the freedom in parent component to control it
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
      data={data}
      ItemSeparatorComponent={() => (
        <View style={[CommonStyles.bigMarginBottom]}></View>
      )}
      contentContainerStyle={[
        {flexGrow: CommonNumbers.one},
        contentContainerStyle,
      ]}
      ListEmptyComponent={() => {
        if (loading || wait) {
          return <SubLoading />; // It won't be center of the screen since we have scrollViewBottomSpace in the bottom of the list
        } else if (!emptyMessage) {
          return <BlankSpace />;
        }
        return (
          <View
            style={[
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
      onEndReached={onEndReached}
      {...rest}
    />
  );
};

NetworkFlatList.propTypes = {
  emptyMessage: PropTypes.string,
  loading: PropTypes.bool,
  delay: PropTypes.bool,
  data: PropTypes.array,
  refetch: PropTypes.func,
  contentContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  onEndReached: PropTypes.func,
  isPageLoading: PropTypes.bool,
};

export default NetworkFlatList;
