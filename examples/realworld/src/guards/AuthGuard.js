import {CommonNumbers} from '@constants/numbers';
import {RouteNames} from '@constants/strings';
import {getNavigationScreenFromAuthState} from '@utils';
import {isEqual} from 'lodash';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const AuthGuard = ({children, navigationRef}) => {
  const auth = useSelector(state => state?.auth);
  const authState = auth?.authState;
  useEffect(() => {
    console.log({component: AuthGuard.name, authState, navigationRef});
    const state = navigationRef?.current?.getState();
    const route = state?.routes?.[CommonNumbers.zero];
    const isFromDeeplink = isEqual(route?.name, RouteNames.DeeplinkHandler);
    console.log({isFromDeeplink});
    if (!isFromDeeplink && authState) {
      //  Assuming userIs is in cache memory
      const navigationScreen = getNavigationScreenFromAuthState(authState);
      if (navigationScreen) {
        navigationRef?.current.reset({
          routes: [{name: getNavigationScreenFromAuthState(authState)}],
        });
      }
    }
  }, [authState]);
  return children;
};

export default AuthGuard;
