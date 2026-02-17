import {PropTypes} from '@constants/imports';
import {IconSizes} from '@constants/numbers';
import {FlexAlignments, Positions} from '@constants/strings';
import {useTheme} from '@theme';
import {useState} from 'react';
import {ActivityIndicator, Image as RNImage, View} from 'react-native';
import styles from './styles';

export default function Image(props) {
  const {source, imageUri, resizeMode, style, onLoadEnd, onError} = props;
  const {colors} = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View
      style={[
        {
          position: Positions.relative,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
        },
      ]}>
      <RNImage
        onLoadEnd={() => {
          onLoadEnd?.();
          setIsLoading(false);
        }}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onError={() => {
          onError?.();
          setIsLoading(false);
        }}
        style={[
          styles.defaultImage,
          {
            backgroundColor: colors.card2,
          },
          style,
        ]}
        resizeMode={resizeMode}
        source={source ?? {uri: imageUri}}
      />
      {isLoading && (
        <ActivityIndicator
          style={[{position: Positions.absolute}]}
          size={IconSizes.big}
          color={colors.primaryLight}
        />
      )}
    </View>
  );
}

Image.propTypes = {
  imageUri: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  source: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  resizeMode: PropTypes.string,
  onLoadEnd: PropTypes.func,
  onError: PropTypes.func,
};
