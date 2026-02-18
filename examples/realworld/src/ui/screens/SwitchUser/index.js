import {CommonStyles} from '@config/styles';
import {CommonDelays} from '@constants/numbers';
import {
  AuthKeys,
  AuthStates,
  FlexAlignments,
  RouteNames,
} from '@constants/strings';
import useCustomApolloClient from '@graphql/apollo';
import {persistor} from '@graphql/cache';
import {
  resetAckComponents,
  resetUserState,
  setActiveLoggedInUser,
  setAuthState,
} from '@redux/slices/authSlice';
import {useTheme} from '@theme';
import {FontWeights, TypographyStyles} from '@typography';
import Button from '@ui/atoms/Button';
import Text from '@ui/atoms/Text';
import FlatList from '@ui/components/FlatList';
import UserCard from '@ui/components/UserCard';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
const SwitchUser = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const auth = useSelector(state => state?.auth);
  const loggedInUsers = auth[AuthKeys.loggedInUsers] ?? [];
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const [userLoadingMap, setUserLoadingMap] = useState({});
  console.log({component: SwitchUser.name, loggedInUsers});
  const apolloClient = useCustomApolloClient();

  return (
    <FlatList
      contentContainerStyle={[
        CommonStyles.bigPaddingTop,
        CommonStyles.bigPaddingHorizontal,
      ]}
      data={loggedInUsers}
      emptyMessage={t('No users')}
      ListHeaderComponent={
        <Text
          style={[
            TypographyStyles.title1,
            {fontWeight: FontWeights.bold},
            CommonStyles.bigMarginBottom,
          ]}>
          {t('Logged in users')}
        </Text>
      }
      ListFooterComponent={
        <Button
          onPress={() => {
            navigation.navigate(RouteNames.SignIn, {
              disableRememberMe: true,
            });
          }}
          style={[
            {
              backgroundColor: colors.primary,
              alignItems: FlexAlignments.center,
            },
            CommonStyles.bigPadding,
            CommonStyles.normalRadius,
            CommonStyles.bigMarginVertical,
          ]}>
          <Text style={[{color: colors.light, fontWeight: FontWeights.medium}]}>
            {t('Login new user')}
          </Text>
        </Button>
      }
      renderItem={({item: user}) => {
        return (
          <UserCard
            onPress={async () => {
              // This is for loading indicator
              setUserLoadingMap(prevUserLoadingMap => ({
                ...prevUserLoadingMap,
                [user?._id]: true,
              }));
              dispatch(setActiveLoggedInUser(user?.ref));
              dispatch(resetAckComponents());
              // Removing all the stored data
              await persistor.purge();
              // Even though we are purging previous query related results will be exist in in memory cache
              // Which causing the initializer to not trigger network request and get the results from in memory cache
              // That causing forbidden/un authorization error
              await apolloClient?.clearStore();
              dispatch(resetUserState());
              setTimeout(() => {
                setUserLoadingMap(prevUserLoadingMap => ({
                  ...prevUserLoadingMap,
                  [user?._id]: false,
                }));
                dispatch(setAuthState(AuthStates.authUnInitialized));
                dispatch(resetUserState());
              }, CommonDelays.waitRedux);
            }}
            user={user}
            loading={userLoadingMap?.[user?._id]}
            handleOffline
          />
        );
      }}
    />
  );
};

export default SwitchUser;
