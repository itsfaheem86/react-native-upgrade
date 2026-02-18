import {CommonStyles} from '@config/styles';
import {displayName} from '@constants/app.json';
import {IconSizes, Paddings} from '@constants/numbers';
import {FlexAlignments} from '@constants/strings';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Text from '@ui/atoms/Text';
import {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';

const MainLoading = props => {
  const {from} = props;
  const {colors} = useTheme();

  useEffect(() => {
    if (from) {
      console.log({component: MainLoading.name, from});
    }
  }, [from]);

  return (
    <View
      style={[
        CommonStyles.fullFlex,
        {
          backgroundColor: colors.primaryDark,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
        },
      ]}>
      <Text
        style={[
          TypographyStyles.header,
          CommonStyles.smallMarginBottom,
          {
            color: colors.light,
            fontWeight: FontWeights.bold,
          },
        ]}>
        {displayName}
      </Text>
      <ActivityIndicator
        style={[{padding: Paddings.small}]}
        size={IconSizes.small}
        color={colors.primaryLight}
      />
    </View>
  );
};

export default MainLoading;
