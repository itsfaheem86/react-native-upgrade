import {CommonDelays, CommonNumbers} from '@constants/numbers';
import {
  AuthKeys,
  AuthStates,
  ColorSchemes,
  DocumentKeys,
  GraphqlPaths,
} from '@constants/strings';
import {persistor} from '@graphql/cache';
import {
  removeLoggedInUser,
  resetAckComponents,
  resetAuthToken,
  resetUserState,
  setAuthState,
} from '@redux/slices/authSlice';
import {removeAuthToken, removeAuthTokenByReference} from '@utils';
import {union, uniqBy} from 'lodash';
import {useEffect, useRef, useState} from 'react';
import {useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useDebounce} from 'react-use';

export const usePagination = (fetchMoreQuery, variables, ifBool = true) => {
  const pageRef = useRef(CommonNumbers.one);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const isPageEndRef = useRef(false);
  const isConnected = useSelector(state => state?.application?.isConnected);

  const onReloadPage = () => {
    isPageEndRef.current = false;
    pageRef.current = CommonNumbers.one;
  };

  const onPausePage = () => {
    isPageEndRef.current = true;
  };

  const onEndReached = async () => {
    if (isPageEndRef.current || isPageLoading || !isConnected || !ifBool) {
      return;
    }
    setIsPageLoading(true);
    try {
      await fetchMoreQuery({
        variables: {
          ...variables,
          paginationDto: {
            ...variables?.paginationDto,
            // Skip will give wrong value when user continually delete the list and in the middle of deleting the page, fetch More triggers
            // Current page with 3 document and fetchMore with page: 2 and size: 10 which skips 7 elements in between.
            page: pageRef.current + CommonNumbers.one,
          },
        },
        updateQuery: (previousQueryResults, {fetchMoreResult, variables}) => {
          const paginationDto = variables[GraphqlPaths.paginationDto];
          pageRef.current = paginationDto?.page;
          const incoming = fetchMoreResult[GraphqlPaths.data];
          if (!incoming?.length) {
            isPageEndRef.current = true;
          }
          // Need a logic to remove duplicates, for now it's ok
          const concatResults = uniqBy(
            union(previousQueryResults[GraphqlPaths.data], incoming),
            DocumentKeys._id,
          );
          console.log({hook: usePagination.name, concatResults});
          return {
            [GraphqlPaths.data]: concatResults,
          };
        },
      });
    } catch (e) {
      console.log({hook: usePagination.name, function: onEndReached.name, e});
    } finally {
      setIsPageLoading(false);
    }
  };

  return {
    onEndReached,
    isPageLoading,
    onReloadPage,
    onPausePage,
    isPageEnd: isPageEndRef.current,
  };
};

export const useSearchBar = refetchQuery => {
  const [filters, setFilters] = useState();
  useDebounce(
    async () => {
      try {
        if (filters) {
          console.log({filters});
          await refetchQuery({
            paginationDto: {filters: filters},
          });
        }
      } catch (e) {
        console.log({hook: useSearchBar.name, e});
      }
    },
    CommonDelays.debounce,
    [filters],
  );
  const onChangeFilters = async filters => {
    setFilters(filters);
  };
  return {onChangeFilters};
};

export const useLogout = apolloClient => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state?.auth);
  const loggedInUsers = auth[AuthKeys.loggedInUsers];
  const selectedUser = useRef(false);
  const extraUserExist = useRef(false);
  useEffect(() => {
    console.log({
      hook: useLogout.name,
      loggedInUsers,
    });
    extraUserExist.current = !!loggedInUsers?.length;
    selectedUser.current = loggedInUsers?.find(loggedInUser => {
      return loggedInUser.active;
    });
  }, [loggedInUsers]);
  const logout = async () => {
    if (selectedUser?.current) {
      // This will modify extraUserExist, infinite means below effects ran before redux update
      dispatch(removeLoggedInUser(selectedUser?.current?.ref));
      // await ms(CommonDelays.waitRedux);
      await removeAuthTokenByReference(selectedUser?.current?.ref);
    }
    // This will let initialize component wait for AuthTokenProvider actions
    dispatch(resetAckComponents());

    await removeAuthToken();
    // Clear cache (safe)
    await apolloClient?.clearStore();
    // Clear the cache as well as resetting any other internal state such as query tracking
    // resetStore triggering stacked queries which gives forbidden error
    // await apolloClient.resetStore();
    // Trigger auth guard to go to login screen/initializer
    // Need to wait for extraUserExist to effect(Above await will be enough I think)
    console.log({
      hook: useLogout.name,
      extraUserExist: extraUserExist.current,
      selectedUser: selectedUser.current,
    });
    // Removing all the stored data
    await persistor.purge();
    dispatch(
      setAuthState(
        extraUserExist.current
          ? AuthStates.authUnInitialized
          : AuthStates.authFailed,
      ),
    );
    dispatch(resetUserState()); // IDK this will cause bug or not
    // I am setting it in the waitRedux to prevent re fetching in some components,
    // If it causes refetch sometime, Solution: Check auth status and remove navigations, I am good for now
    setTimeout(() => {
      dispatch(resetAuthToken());
      // This code is running after initialize setting userType and _id which is introducing more bugs and initialize is currently not waiting for this code to run.
      // So we can remove this code since initialize will set userType and other info before going to home.
    }, CommonDelays.waitRedux);
  };
  return logout;
};

export const useIsDarkMode = () => {
  const isDarkMode = useColorScheme() === ColorSchemes.dark;
  return isDarkMode;
};

export const useRemainingTime = time => {
  const [remainingTime, setRemainingTime] = useState(time);
  const intervalRef = useRef(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingTime(remainingTime - CommonNumbers.oneSecondInMilliSeconds);
    }, CommonNumbers.oneSecondInMilliSeconds);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [remainingTime]);
  return remainingTime;
};
