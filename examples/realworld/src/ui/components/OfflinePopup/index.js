import {CommonStyles} from '@config/styles';
import {CommonWidths, Opacities, zIndices} from '@constants/numbers';
import {
  DisplayTypes,
  FlexAlignments,
  FlexDirections,
  IconNames,
  IconTypes,
  Positions,
  TextAlignments,
} from '@constants/strings';
import {useTheme} from '@theme';
import {TypographyStyles} from '@typography';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useSelector} from 'react-redux';

const OfflinePopup = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const isConnected = useSelector(state => state?.application?.isConnected);
  return (
    <View
      style={[
        {
          position: Positions.absolute,
          backgroundColor: colors.primaryLight,
          width: CommonWidths.fullParent,
          alignSelf: FlexAlignments.center,
          zIndex: zIndices.one,
          flexDirection: FlexDirections.row,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
          opacity: Opacities.half,
          display: isConnected ? DisplayTypes.none : DisplayTypes.flex,
        },
      ]}>
      <Icon
        type={IconTypes.Ionicons}
        style={[CommonStyles.bigMarginRight]}
        name={IconNames.cloudOffline}
        color={colors.text}
      />
      <Text
        style={[
          {
            textAlign: TextAlignments.center,
          },
          TypographyStyles.body2,
        ]}>
        {t('No internet connection')}
      </Text>
    </View>
  );
};

export default OfflinePopup;
