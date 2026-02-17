import {PropTypes} from '@constants/imports';
import {CommonIndices, IconSizes} from '@constants/numbers';
import {FlexAlignments, Positions} from '@constants/strings';
import {useTheme} from '@theme';
import {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Avatar as RnPaperAvatar} from 'react-native-paper';
import Image from '../Image';
import styles from './styles';

export default function Avatar(props) {
  const {imageUri, imageStyle, label, loading, onAvatarLoadEnd, onAvatarError} =
    props;
  const {colors} = useTheme();
  const avatarStyles = StyleSheet.flatten([styles.defaultAvatar, imageStyle]);

  useEffect(() => {
    if (!imageUri) {
      onAvatarLoadEnd?.();
    }
  }, [imageUri, onAvatarLoadEnd]);

  return (
    <View
      style={[
        {
          position: Positions.relative,
          justifyContent: FlexAlignments.center,
          alignItems: FlexAlignments.center,
          // Make the parent take children's width
          alignSelf: FlexAlignments.flexStart,
        },
      ]}>
      {imageUri ? (
        <Image
          style={avatarStyles}
          source={{uri: imageUri}}
          onLoadEnd={onAvatarLoadEnd}
          onError={onAvatarError}
        />
      ) : (
        <RnPaperAvatar.Text
          style={avatarStyles}
          label={label?.[CommonIndices.zero]}
          backgroundColor={colors.accent}
          labelStyle={{
            textAlign: 'center',
            textAlignVertical: 'center',
            textTransform: 'uppercase', // This makes the text capital
          }}
          size={avatarStyles.width} // Ensure proper sizing
        />
      )}
      {loading && (
        <ActivityIndicator
          style={[{position: Positions.absolute}]}
          size={IconSizes.big}
          color={colors.primaryLight}
        />
      )}
    </View>
  );
}

Avatar.propTypes = {
  imageUri: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
