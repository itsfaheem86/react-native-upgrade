import {CommonStyles} from '@config/styles';
import {
  BorderWidths,
  CommonHeights,
  CommonWidths,
  Opacities,
  Radiuses,
} from '@constants/numbers';
import {
  fetchPolicyValues,
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetMeQuery} from '@graphql/actions/auth/queries';
import {useGetMemberAccountsQuery} from '@graphql/actions/member/queries';
import {setDefaultAccount} from '@redux/slices/authSlice';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Text from '@ui/atoms/Text';
import {get} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {Menu} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

const CustomHeaderRight = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const defaultAccount = auth[UserKeys.defaultAccount];
  const userType = auth[UserKeys.userType];
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);
  const {t} = useTranslation();

  const [getMemberAccountsQuery, {data: getMemberAccountsData}] =
    useGetMemberAccountsQuery();

  const [getMeQuery, {data: getMeData}] = useGetMeQuery();

  useEffect(() => {
    if (userType === UserTypes.Member) {
      getMemberAccountsQuery({fetchPolicy: fetchPolicyValues.networkOnly});
    } else if (userType === UserTypes.Society) {
      getMeQuery(); // Call getMeQuery for Society users
    }
  }, [userType]);

  const accounts = get(getMemberAccountsData, GraphqlPaths.data, []);
  const user = get(getMeData, GraphqlPaths.data); // Get user data for Society

  const isSelectedAccount = account => {
    return account._id === defaultAccount?._id;
  };

  // If user type is Society, just show the avatar with proper spacing
  if (userType === UserTypes.Society) {
    return (
      <View
        style={[
          CommonStyles.bigMarginRight,
          {
            flexDirection: FlexDirections.row,
            alignItems: FlexAlignments.center,
          },
        ]}>
        <Text
          style={[
            TypographyStyles.body1,
            CommonStyles.smallMarginRight,
            {color: colors.primaryDark, fontWeight: FontWeights.bold},
          ]}>
          {user?.name}
        </Text>

        <Avatar
          imageUri={user?.avatar}
          label={user?.name}
          imageStyle={{
            width: CommonWidths.themePicker,
            height: CommonHeights.themePicker,
            borderRadius: Radiuses.themePicker,
          }}
        />
      </View>
    );
  }

  // If user type is Member but has only one account, show non-clickable avatar with proper spacing
  if (userType === UserTypes.Member && accounts.length === 1) {
    return (
      <View
        style={[
          CommonStyles.bigMarginRight,
          {
            flexDirection: FlexDirections.row,
            alignItems: FlexAlignments.center,
          },
        ]}>
        <Text
          style={[
            TypographyStyles.body1,
            CommonStyles.smallMarginRight,
            {color: colors.primaryDark, fontWeight: FontWeights.bold},
          ]}>
          {defaultAccount?.society?.name}
        </Text>
        {/* optional spacing */}
        <Avatar
          imageUri={defaultAccount?.society?.avatar}
          label={defaultAccount?.society?.name}
          imageStyle={{
            width: CommonWidths.themePicker,
            height: CommonHeights.themePicker,
            borderRadius: Radiuses.themePicker,
          }}
        />
      </View>
    );
  }

  if (userType === UserTypes.Member && accounts.length < 1) {
    return null;
  }

  // Only show dropdown for Members with multiple accounts
  return (
    <View style={[CommonStyles.bigMarginRight]}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={[
              {
                flexDirection: FlexDirections.row,
                alignItems: FlexAlignments.center,
              },
            ]} // ensures horizontal layout and vertical centering
          >
            <Text
              style={[
                TypographyStyles.body1,
                CommonStyles.smallMarginRight,
                {color: colors.primaryDark, fontWeight: FontWeights.bold},
              ]}>
              {defaultAccount?.society?.name}
            </Text>
            {/* optional spacing */}
            <Avatar
              imageUri={defaultAccount?.society?.avatar}
              label={defaultAccount?.society?.name}
              imageStyle={{
                width: CommonWidths.themePicker,
                height: CommonHeights.themePicker,
                borderRadius: Radiuses.themePicker,
              }}
            />
          </TouchableOpacity>
        }
        contentStyle={[
          CommonStyles.smallPadding,
          {
            backgroundColor: colors.light,
            borderRadius: Radiuses.normalIcon,

            minWidth: CommonWidths.cardImage,
          },
        ]}
        style={[CommonStyles.bigMarginTop]}>
        <View
          style={[
            CommonStyles.normalPadding,
            CommonStyles.smallMarginBottom,
            {
              borderBottomWidth: BorderWidths.normal,
              borderBottomColor: colors.card2,
            },
          ]}>
          <Text
            style={[
              TypographyStyles.body1,
              CommonStyles.smallMarginRight,
              {color: colors.primary, fontWeight: FontWeights.bold},
            ]}>
            {t('Select Society')}
          </Text>
        </View>
        {accounts.map(account => {
          const isSelected = isSelectedAccount(account);
          return (
            <View
              key={account._id}
              style={[
                CommonStyles.smallMarginVertical,
                isSelected && {backgroundColor: colors.accent + '40'},
                {borderRadius: Radiuses.small, overflow: 'hidden'},
              ]}>
              <Menu.Item
                title={account.society?.name}
                onPress={
                  isSelected
                    ? undefined
                    : () => {
                        dispatch(setDefaultAccount(account));
                        setVisible(false);
                      }
                }
                titleStyle={[
                  TypographyStyles.body2,
                  CommonStyles.smallMarginLeft,
                  // isSelected && {color: colors.accent},
                ]}
                style={{borderRadius: Radiuses.smallest}}
                leadingIcon={() => (
                  <Avatar
                    imageUri={account.society?.avatar}
                    label={account.society?.name}
                    imageStyle={[
                      isSelected && {opacity: Opacities.half},
                      {
                        width: CommonWidths.themePicker,
                        height: CommonHeights.themePicker,
                        borderRadius: Radiuses.themePicker,
                      },
                    ]}
                  />
                )}
                disabled={isSelected}
              />
            </View>
          );
        })}
      </Menu>
    </View>
  );
};

export default CustomHeaderRight;
