import {CharacterPng} from '@assets/pngs';
import {CommonStyles} from '@config/styles';
import {
  CommonHeights,
  CommonNumbers,
  CommonWidths,
  Radiuses,
} from '@constants/numbers';
import {FlexAlignments, RouteNames} from '@constants/strings';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Image from '@ui/atoms/Image';
import Text from '@ui/atoms/Text';
import TextButton from '@ui/components/TextButton';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

const JoinSocietyCard = props => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {navigation} = props;
  return (
    <View
      style={[
        {
          backgroundColor: colors.card2,
          borderRadius: Radiuses.normal,
          elevation: CommonNumbers.one,
        },
        CommonStyles.bigMarginBottom,
      ]}>
      <Image
        style={[
          {
            width: CommonWidths.fullParent,
            borderRadius: Radiuses.normal,
            height: CommonHeights.cartoon,
          },
        ]}
        source={CharacterPng}
      />
      <View
        style={[
          CommonStyles.normalPadding,
          {
            justifyContent: FlexAlignments.flexStart,
            alignItems: FlexAlignments.flexStart,
          },
        ]}>
        <Text
          style={[
            TypographyStyles.caption1,
            {fontWeight: FontWeights.bold},
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Join society and track your account information')}
        </Text>
        <Text
          style={[TypographyStyles.caption1, CommonStyles.smallMarginBottom]}>
          {t(
            'You can keep track of any financial and event related information without any issue',
          )}
        </Text>
        <TextButton
          onPress={() => {
            navigation.navigate(RouteNames.Societies);
          }}
          textStyle={[
            TypographyStyles.caption1,
            {
              color: colors.primary,
              fontWeight: FontWeights.bold,
            },
          ]}
          defaultAccount
          text={t('Join now')}
        />
      </View>
    </View>
  );
};

export default JoinSocietyCard;
