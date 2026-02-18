import {IconSizes} from '@constants/numbers';
import {
  IconNames,
  IconTypes,
  RouteLabels,
  RouteNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TypographyStyles} from '@typography';
import Icon from '@ui/atoms/Icon';
import PaidAmountHistory from '@ui/screens/Amount/History';
import Home from '@ui/screens/Home';
import SocietyInfo from '@ui/screens/Info/Society';
import MemberRequests from '@ui/screens/MemberRequests';
import Members from '@ui/screens/Members';
import Societies from '@ui/screens/Societies';
import {useSelector} from 'react-redux';

const BottomTabStack = () => {
  const BottomTab = createBottomTabNavigator();
  const auth = useSelector(state => state?.auth);
  const userType = auth[UserKeys.userType];
  const defaultAccount = auth[UserKeys.defaultAccount];
  console.log({component: BottomTabStack.name, defaultAccount, userType});
  const navigations = [
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon
                type={IconTypes.EntypoIcon}
                color={color}
                name={IconNames.home}
                size={size}
              />
            ),
            tabBarIconStyle: {
              width: IconSizes.big,
            },
            tabBarLabelStyle: TypographyStyles.caption2,
          }}
          name={RouteNames.Home}
          key={RouteNames.Home}
          component={Home}
        />
      ),
      roles: [UserTypes.Member, UserTypes.Society, UserTypes.Unknown],
    },
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon color={color} name={IconNames.handsHelping} size={size} />
            ),
            tabBarLabelStyle: TypographyStyles.caption2,
            tabBarLabel: RouteLabels.MemberSocietyInfo,
          }}
          name={RouteNames.MemberSocietyInfo}
          key={RouteNames.MemberSocietyInfo}
          component={SocietyInfo}
        />
      ),
      roles: [UserTypes.Member],
      // For now to prevent multiple society logics
      conditionCheck: () => defaultAccount?.active,
    },
    // {
    //   bottomTabScreen: (
    //     <BottomTab.Screen
    //       options={{
    //         tabBarIcon: ({color, size}) => (
    //           <Icon
    //             color={color}
    //             type={IconTypes.default}
    //             name={IconNames.table}
    //             size={size}
    //           />
    //         ),
    //         tabBarIconStyle: {
    //           width: IconSizes.big,
    //         },
    //         tabBarLabelStyle: TypographyStyles.caption2,
    //       }}
    //       name={RouteNames.Events}
    //       key={RouteNames.Events}
    //       component={Events}
    //     />
    //   ),
    //   roles: [UserTypes.Society, UserTypes.Member],
    // },
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon color={color} name={IconNames.history} size={size} />
            ),
            tabBarIconStyle: {
              width: IconSizes.big,
            },
            tabBarLabelStyle: TypographyStyles.caption2,
            tabBarLabel: RouteLabels.PaidAmountHistory,
          }}
          name={RouteNames.PaidAmountHistory}
          key={RouteNames.PaidAmountHistory}
          component={PaidAmountHistory}
        />
      ),
      roles: [UserTypes.Society, UserTypes.Member],
      conditionCheck: () =>
        defaultAccount?.active || userType === UserTypes.Society,
    },
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon color={color} name={IconNames.users} size={size} />
            ),
            tabBarIconStyle: {
              width: IconSizes.big,
            },
            tabBarLabelStyle: TypographyStyles.caption2,
          }}
          name={RouteNames.Members}
          key={RouteNames.Members}
          component={Members}
        />
      ),
      roles: [UserTypes.Member, UserTypes.Society, UserTypes.Unknown],
      conditionCheck: () =>
        defaultAccount?.active || userType === UserTypes.Society,
    },
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon color={color} name={IconNames.userPlus} size={size} />
            ),
            tabBarIconStyle: {
              width: IconSizes.big,
            },
            tabBarLabelStyle: TypographyStyles.caption2,
          }}
          name={RouteNames.Requests}
          key={RouteNames.Requests}
          component={MemberRequests}
        />
      ),
      roles: [UserTypes.Society],
    },
    {
      bottomTabScreen: (
        <BottomTab.Screen
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon color={color} name={IconNames.handsHelping} size={size} />
            ),
            tabBarLabelStyle: TypographyStyles.caption2,
          }}
          name={RouteNames.Societies}
          key={RouteNames.Societies}
          component={Societies}
        />
      ),
      roles: [UserTypes.Member],
      conditionCheck: () => !defaultAccount?.active,
    },
  ];

  const filteredNavigations = navigations.filter(
    bTNavigation =>
      bTNavigation.roles.includes(userType) &&
      (bTNavigation.conditionCheck ? bTNavigation.conditionCheck() : true),
  );

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
      initialRouteName={RouteNames.Home}>
      {filteredNavigations.map(bTNavigation => bTNavigation.bottomTabScreen)}
    </BottomTab.Navigator>
  );
};

export default BottomTabStack;
