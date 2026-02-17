import {CommonStrings, RouteNames} from '@constants/strings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '@theme';
import PaidAccountAmountHistory from '@ui/screens/Amount/AccountHistory';
import CreateOrEditPaidAmount from '@ui/screens/Amount/CreateOrEdit';
import MemberAnalytics from '@ui/screens/Analytics/Member';
import SocietyAnalytics from '@ui/screens/Analytics/Society';
import BlockedMembers from '@ui/screens/BlockedMembers';
import DeeplinkHandler from '@ui/screens/DeeplinkHandler';
import EventAccounts from '@ui/screens/Events/Accounts';
import CreateOrEditEvent from '@ui/screens/Events/CreateOrEditEvent';
import MemberInfo from '@ui/screens/Info/Member';
import Initialize from '@ui/screens/Initialize';
import ForgotPassword from '@ui/screens/Password/Forgot';
import NewPassword from '@ui/screens/Password/New';
import EditMemberProfile from '@ui/screens/Profile/Member';
import EditSocietyProfile from '@ui/screens/Profile/Society';
import RecordAccounts from '@ui/screens/Record/Accounts';
import CreateOrEditRecord from '@ui/screens/Record/CreateOrEdit';
import Reports from '@ui/screens/Reports';
import SignIn from '@ui/screens/SignIn';
import SignUp from '@ui/screens/SignUp';
import Societies from '@ui/screens/Societies';
import SwitchUser from '@ui/screens/SwitchUser';
import CreateOrEditCostType from '@ui/screens/Types/CreateOrEdit/Cost';
import CreateOrEditCreditType from '@ui/screens/Types/CreateOrEdit/Credit';
import Types from '@ui/screens/Types/List';
import VerifyOTP from '@ui/screens/Verify/OTP';
import SideDrawer from './SideDrawer';

const MainStack = () => {
  const Stack = createNativeStackNavigator();
  const {colors} = useTheme();

  return (
    <Stack.Navigator initialRouteName={RouteNames.Initialize}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={RouteNames.Initialize}
        component={Initialize}
      />
      {/* Queries */}
      <Stack.Screen
        // Child stack will show header info
        options={{
          headerShown: false,
        }}
        name={RouteNames.SideDrawer}
        component={SideDrawer}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={RouteNames.SignIn}
        component={SignIn}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.RecordTypes}
        component={Types}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.RecordAccounts}
        component={RecordAccounts}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.EventAccounts}
        component={EventAccounts}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.MemberInfo}
        component={MemberInfo}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.PaidAccountAmountHistory}
        component={PaidAccountAmountHistory}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.BlockedMembers}
        component={BlockedMembers}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.SocietyAnalytics}
        component={SocietyAnalytics}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.MemberAnalytics}
        component={MemberAnalytics}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.Reports}
        component={Reports}
      />
      {/* Mutations */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.SignUp}
        component={SignUp}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.SwitchUser}
        component={SwitchUser}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.CreateOrEditRecord}
        component={CreateOrEditRecord}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.CreateOrEditCreditType}
        component={CreateOrEditCreditType}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.CreateOrEditCostType}
        component={CreateOrEditCostType}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.VerifyOTP}
        component={VerifyOTP}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.NewPassword}
        component={NewPassword}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.EditSocietyProfile}
        component={EditSocietyProfile}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.EditMemberProfile}
        component={EditMemberProfile}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.CreateOrEditPaidAmount}
        component={CreateOrEditPaidAmount}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.CreateOrEditEvent}
        component={CreateOrEditEvent}
      />
      {/* Deeplink handler */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.DeeplinkHandler}
        component={DeeplinkHandler}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: colors.primaryDark,
          title: CommonStrings.empty,
          headerShadowVisible: false,
        }}
        name={RouteNames.Societies}
        component={Societies}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
