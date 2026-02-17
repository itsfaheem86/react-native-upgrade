import Config from '@config/config';
import {PropTypes} from '@constants/imports';
import {
  AwsKeys,
  AxiosKeys,
  CommonStrings,
  GraphqlPaths,
  MediaTypes,
} from '@constants/strings';
import {useCreatePresignedUriMutation} from '@graphql/actions/aws/mutations';
import {useTheme} from '@theme';
import Avatar from '@ui/atoms/Avatar';
import Button from '@ui/atoms/Button';
import axios from 'axios';
import {useState} from 'react';
import DImagePicker from 'react-native-image-crop-picker';
import styles from './styles';

const ImagePicker = props => {
  const {onImagePick, imageStyle, onBlur, imageUri, upload} = props;
  const {colors} = useTheme();
  const [createPresignedUriMutation, {loading: isCreatePresignedUriLoading}] =
    useCreatePresignedUriMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onPickPress = () => {
    DImagePicker.openPicker({
      mediaType: MediaTypes.photo,
      cropping: false,
    })
      .then(response => {
        return DImagePicker.openCropper({
          path: response.path,
          freeStyleCropEnabled: true,
          cropperActiveWidgetColor: colors.primary,
          cropperStatusBarColor: colors.primary,
          cropperToolbarWidgetColor: colors.primary,
          cropperToolbarTitle: CommonStrings.empty,
          cropperToolbarColor: colors.light,
          compressImageQuality: 0.5,
        });
      })
      .then(async response => {
        console.log({component: ImagePicker.name, response});
        setIsLoading(true);
        const file = {
          uri: response?.path,
          type: response?.mime,
        };
        if (upload) {
          console.log({component: ImagePicker.name, file});
          const {data} = await createPresignedUriMutation({
            variables: {
              createPresignedUriDto: {
                type: file.type,
              },
            },
          });
          const s3PresignedPayload = data?.[GraphqlPaths.data];
          const fields = JSON.parse(s3PresignedPayload?.fields);
          console.log({
            component: ImagePicker.name,
            s3PresignedPayload,
            fields,
          });
          const preSignedUploadFormData = new FormData();
          preSignedUploadFormData.append(AxiosKeys.contentType, file.type);
          Object.keys(fields).forEach(key => {
            preSignedUploadFormData.append(key, fields[key]);
          });
          preSignedUploadFormData.append(AwsKeys.file, file);
          console.log({
            component: ImagePicker.name,
            preSignedUploadFormData,
          });
          const s3Response = await axios.post(
            s3PresignedPayload?.uploadUri,
            preSignedUploadFormData,
          );
          console.log({component: ImagePicker.name, s3Response});
          // We need to remove s3BucketUri to upload key to the server
          file.uri = Config.awsS3BucketCloudFrontUri + fields?.Key;
        }
        onImagePick?.(file);
      })
      .catch(e => {
        // Throwing error on cancel
        // showDefaultToast({message: e?.message});
        if (!imageUri) {
          onImagePick?.({});
        }
        onBlur?.();
        console.log({component: ImagePicker.name, e: e});
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Button onPress={onPickPress}>
      <Avatar
        loading={isCreatePresignedUriLoading || isLoading}
        imageUri={imageUri}
        imageStyle={[styles.image, imageStyle]}
      />
    </Button>
  );
};

ImagePicker.propTypes = {
  onImagePick: PropTypes.func,
  onBlur: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageUri: PropTypes.string,
  upload: PropTypes.bool,
};

export default ImagePicker;
