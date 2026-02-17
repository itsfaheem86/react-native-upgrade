import {CommonStrings, RouteNames} from '@constants/strings';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTheme} from '@theme';
import BottomTabStack from '../BottomTabStack';
import CustomHeaderRight from './CustomHeaderRight';
import CustomSideDrawerContent from './CustomSideDrawerContent';

const SideDrawer = () => {
  const {colors} = useTheme();
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomSideDrawerContent {...props} />}
      screenOptions={{
        headerRight: () => <CustomHeaderRight />,
      }}>
      <Drawer.Screen
        name={RouteNames.BottomTabStack}
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        component={BottomTabStack}
      />
    </Drawer.Navigator>
  );
};

export default SideDrawer;
