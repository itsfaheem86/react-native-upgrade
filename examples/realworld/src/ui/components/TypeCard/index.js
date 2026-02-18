import {CommonStyles} from '@config/styles';
import {
  BookCategory,
  FlexDirections,
  IconNames,
  IconTypes,
  RouteNames,
} from '@constants/strings';
import {
  useDeleteSocietyCostTypeMutation,
  useDeleteSocietyCreditTypeMutation,
} from '@graphql/actions/society/mutations';
import {useTheme} from '@theme';
import Text from '@ui/atoms/Text';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import DialogBox from '../DialogBox';
import IconButton from '../IconButton';
import NetworkIconButton from '../NetworkIconButton';
import styles from './styles';

const TypeCard = props => {
  const {navigation, type, bookType} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [
    deleteSocietyCreditTypeMutation,
    {loading: isDeleteSocietyCreditTypeLoading},
  ] = useDeleteSocietyCreditTypeMutation();

  const [
    deleteSocietyCostTypeMutation,
    {loading: isDeleteSocietyCostTypeLoading},
  ] = useDeleteSocietyCostTypeMutation();

  const [showDialog, setShowDialog] = useState(false);

  return (
    <View
      style={[
        styles.defaultTypeCard,
        CommonStyles.normalPadding,
        CommonStyles.normalRadius,
        {
          backgroundColor: colors.card2,
        },
      ]}>
      <View style={[CommonStyles.fullFlex]}>
        <Text>{type?.name}</Text>
      </View>
      <View style={[{flexDirection: FlexDirections.row}]}>
        <NetworkIconButton
          iconStyle={[{color: colors.error}]}
          buttonStyle={[CommonStyles.bigMarginRight]}
          iconType={IconTypes.MaterialCommunityIcons}
          iconName={IconNames.delete}
          loading={
            isDeleteSocietyCreditTypeLoading || isDeleteSocietyCostTypeLoading
          }
          onPress={() => setShowDialog(true)}
        />
        <IconButton
          iconType={IconTypes.EntypoIcon}
          iconName={IconNames.edit}
          onPress={() => {
            if (bookType === BookCategory.credit) {
              navigation.navigate(RouteNames.CreateOrEditCreditType, {type});
            } else {
              navigation.navigate(RouteNames.CreateOrEditCostType, {type});
            }
          }}
          handleOffline
        />
      </View>
      <DialogBox
        showDialog={showDialog}
        onHideDialog={() => {
          setShowDialog(false);
        }}
        onRightPress={() => {
          if (bookType === BookCategory.credit) {
            deleteSocietyCreditTypeMutation({
              variables: {
                deleteSocietyCreditTypeDto: {
                  typeId: type?._id,
                },
              },
            });
          } else {
            deleteSocietyCostTypeMutation({
              variables: {
                deleteSocietyCostTypeDto: {
                  typeId: type?._id,
                },
              },
            });
          }
        }}
        rightTextStyle={{color: colors.error}}
        title={t('Caution!!!')}>
        <Text
          style={[
            CommonStyles.bigMarginHorizontal,
            CommonStyles.smallMarginBottom,
          ]}>
          {t('Do you really wanna remove this type?')}
        </Text>
      </DialogBox>
    </View>
  );
};

export default TypeCard;
