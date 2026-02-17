import {useApolloClient} from '@apollo/client';
import {CommonStyles} from '@config/styles';
import {CommonNumbers, Paddings} from '@constants/numbers';
import {
  FlexAlignments,
  FlexDirections,
  GraphqlPaths,
  IconNames,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {useGetMeQuery} from '@graphql/actions/auth/queries';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Avatar from '@ui/atoms/Avatar';
import Icon from '@ui/atoms/Icon';
import Text from '@ui/atoms/Text';
import {useLogout} from '@utils/hooks';
import {get} from 'lodash';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Divider, Drawer} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import ExpiredAfter from './ExpiredAfter';

const CustomSideDrawerContent = props => {
  const {t} = useTranslation();
  const {navigation} = props;
  const {colors} = useTheme();
  const apolloClient = useApolloClient();
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const isSociety = userType === UserTypes.Society;
  const logout = useLogout(apolloClient);
  const defaultAccount = auth[UserKeys.defaultAccount];

  const insets = useSafeAreaInsets();

  const [getMeQuery, {data: getMeData}] = useGetMeQuery();
  console.log({component: CustomSideDrawerContent.name, getMeData});
  useEffect(() => {
    getMeQuery();
  }, []);

  const user = get(getMeData, GraphqlPaths.data);

  const onLogout = async () => {
    logout();
  };
  const scrollViewNavigations = [
    {
      // If you want divider add separate on instead of showDivider
      drawerSection: (
        <Drawer.Section
          // Same key that's why
          key={RouteNames.Profile + CommonNumbers.zero}
          showDivider={false}>
          <View
            style={{
              padding: Paddings.normal,
              flexDirection: FlexDirections.row,
              justifyContent: FlexAlignments.center,
              alignItems: FlexAlignments.center,
            }}>
            <Avatar
              imageStyle={[CommonStyles.smallMarginRight]}
              imageUri={user?.avatar}
              label={user?.name}
            />
            <View style={[CommonStyles.fullFlex]}>
              <Text
                numberOfLines={CommonNumbers.one}
                style={[{fontWeight: FontWeights.bold}]}>
                {user?.name}
              </Text>
              <Text
                numberOfLines={CommonNumbers.one}
                style={[TypographyStyles.caption1]}>
                {user?.email}
              </Text>
              {!!user?.activeAccountsCount && (
                <View
                  style={[
                    {
                      flexDirection: FlexDirections.row,
                      alignItems: FlexAlignments.center,
                    },
                    CommonStyles.smallMarginTop,
                  ]}>
                  <Text
                    style={[
                      TypographyStyles.caption1,
                      CommonStyles.smallMarginRight,
                    ]}>
                    {user?.activeAccountsCount}
                  </Text>
                  <Icon style={{color: colors.text}} name={IconNames.users} />
                </View>
              )}
            </View>
          </View>
          <Divider
            style={[
              {backgroundColor: colors.primaryDark, height: CommonNumbers.one},
            ]}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Member, UserTypes.Society],
    },
    {
      drawerSection: (
        <Drawer.Section
          // Same key that's why
          key={RouteNames.Profile + CommonNumbers.one}
          showDivider={false}>
          <DrawerItem
            label={t('Profile')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              if (userType === UserTypes.Society) {
                navigation.navigate(RouteNames.EditSocietyProfile);
              } else {
                navigation.navigate(RouteNames.EditMemberProfile);
              }
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Member, UserTypes.Society],
    },
    {
      drawerSection: (
        <Drawer.Section key={RouteNames.Societies} showDivider={false}>
          <DrawerItem
            label={t('Societies')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              navigation.navigate(RouteNames.Societies);
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Member],
    },
    {
      drawerSection: (
        <Drawer.Section
          key={
            isSociety ? RouteNames.SocietyAnalytics : RouteNames.MemberAnalytics // Currently no need member analytics
          }
          showDivider={false}>
          <DrawerItem
            label={t('Analytics')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              if (isSociety) {
                navigation.navigate(RouteNames.SocietyAnalytics);
              } else {
                navigation.navigate(RouteNames.MemberAnalytics);
              }
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Member, UserTypes.Society],
      conditionCheck: () => defaultAccount?.active || isSociety,
    },
    {
      drawerSection: (
        <Drawer.Section key={RouteNames.Reports} showDivider={false}>
          <DrawerItem
            label={t('Reports')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              navigation.navigate(RouteNames.Reports);
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Society],
    },
    {
      drawerSection: (
        <Drawer.Section key={RouteNames.RecordTypes} showDivider={false}>
          <DrawerItem
            label={t('Record type')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              navigation.navigate(RouteNames.RecordTypes);
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Society],
    },
    {
      drawerSection: (
        <Drawer.Section key={RouteNames.BlockedMembers} showDivider={false}>
          <DrawerItem
            label={t('Blocked members')}
            labelStyle={{color: colors.text}}
            onPress={() => {
              navigation.navigate(RouteNames.BlockedMembers);
            }}
          />
        </Drawer.Section>
      ),
      roles: [UserTypes.Society],
    },
  ];

  const filteredScrollViewNavigations = scrollViewNavigations.filter(
    sVNavigation =>
      sVNavigation.roles.includes(userType) &&
      (sVNavigation.conditionCheck ? sVNavigation.conditionCheck() : true),
  );

  return (
    <View style={[CommonStyles.fullFlex]}>
      <DrawerContentScrollView {...props}>
        {filteredScrollViewNavigations.map(
          sVNavigation => sVNavigation.drawerSection,
        )}
      </DrawerContentScrollView>
      <Drawer.Section
        style={[CommonStyles.bigMarginBottom]}
        showDivider={false}>
        <DrawerItem
          labelStyle={{color: colors.text}}
          label={t('Switch user')}
          onPress={() => {
            navigation.navigate(RouteNames.SwitchUser);
          }}
        />
        <DrawerItem
          labelStyle={{color: colors.text}}
          label={_ => (
            <View>
              <Text
                style={[
                  TypographyStyles.body2,
                  {fontWeight: FontWeights.medium},
                ]}>
                {t('Logout')}
              </Text>
              <ExpiredAfter />
            </View>
          )}
          onPress={onLogout}
        />
        <Divider
          style={[
            {backgroundColor: colors.primaryDark, marginBottom: insets.bottom},
          ]}
        />
      </Drawer.Section>
    </View>
  );
};

export default CustomSideDrawerContent;
