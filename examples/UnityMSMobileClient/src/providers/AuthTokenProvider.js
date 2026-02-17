import {CommonNumbers} from '@constants/numbers';
import {
  AuthKeys,
  AuthStates,
  ComponentNames,
  MomentUnitOfTimes,
} from '@constants/strings';
import {
  pushAckComponents,
  setAuthState,
  setExpiredAfter,
} from '@redux/slices/authSlice';
import {getAuthTokenByReference, setAuthToken} from '@utils';
import {jwtDecode} from 'jwt-decode';
import moment from 'moment';
import {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const AuthTokenProvider = props => {
  const {children} = props;
  const auth = useSelector(state => state?.auth);
  const dispatch = useDispatch();
  const loggedInUsers = auth[AuthKeys.loggedInUsers];
  const selectedUser = loggedInUsers?.find(loggedInUser => {
    return loggedInUser.active;
  });
  const {token: tempAuthToken} = auth;
  const timeoutRef = useRef(null);
  useEffect(() => {
    console.log({
      component: AuthTokenProvider.name,
      loggedInUsers,
      selectedUser,
    });
    const setSelectedUserAuthToken = async selectedUser => {
      try {
        // If selectedUser/tempAuthToken is not defined then user is not logged in
        // selectedUser/tempAuthToken will be set in sing in page
        if (!selectedUser && !tempAuthToken) {
          return dispatch(setAuthState(AuthStates.authFailed));
        } else if (selectedUser) {
          const selectedUserAuthToken = await getAuthTokenByReference(
            selectedUser?.ref,
          );
          const authPayload = jwtDecode(selectedUserAuthToken);
          const tokenExpiredAt = moment(authPayload?.expiredAt);
          const logoutAfter = tokenExpiredAt.diff(
            moment(),
            MomentUnitOfTimes.milliseconds,
          );
          console.log({
            component: AuthTokenProvider.name,
            logoutAfter,
          });
          // Token should be defined since jwtDecode will trow error if there is no token
          await setAuthToken(selectedUserAuthToken);
          if (logoutAfter > CommonNumbers.zero) {
            // If user token need to be revalidated we need to re initialize on logoutAfter seconds.
            timeoutRef.current = setTimeout(() => {
              dispatch(setAuthState(AuthStates.authUnInitialized));
            }, logoutAfter);
            dispatch(setExpiredAfter(logoutAfter));
          } else {
            dispatch(setExpiredAfter(null));
          }
          // AuthTokenProvider acks means initialize will trigger a http call :(
          dispatch(pushAckComponents(ComponentNames.AuthTokenProvider));
        }
      } catch (e) {
        console.log({component: AuthTokenProvider.name, e});
        dispatch(setAuthState(AuthStates.authFailed));
      }
    };
    setSelectedUserAuthToken(selectedUser);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [selectedUser?.ref, tempAuthToken]);
  return children;
};

export default AuthTokenProvider;
