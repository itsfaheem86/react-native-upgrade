import {CommonNumbers} from '@constants/numbers';
import {
  AuthKeys,
  AuthStates,
  CommonStrings,
  SliceNames,
  UserKeys,
  UserTypes,
} from '@constants/strings';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  authState: AuthStates.authLoading,
  expiredAfter: null,
  token: CommonStrings.empty,
  [UserKeys.userType]: UserTypes.Unknown,
  // I know default account is an object but Initially I used only to store string,
  // after many changes it become object but I am scare to change initial value to an object :(
  [UserKeys.defaultAccount]: CommonStrings.empty,
  [UserKeys._id]: CommonStrings.empty,
  [AuthKeys.loggedInUsers]: [],
  ackComponents: [],
};

export const authSlice = createSlice({
  name: SliceNames.auth,
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
    setExpiredAfter: (state, action) => {
      state.expiredAfter = action.payload;
    },
    setUserToken: (state, action) => {
      state.token = action?.payload;
    },
    pushLoggedInUser: (state, action) => {
      state[AuthKeys.loggedInUsers] = [
        ...state[AuthKeys.loggedInUsers]
          ?.map(loggedInUser => {
            return {...loggedInUser, active: false};
          })
          .filter(loggedInUser => loggedInUser?.ref !== action.payload?.ref),
        {...action.payload, active: true},
      ];
    },
    setLoggedInUser: (state, action) => {
      state[AuthKeys.loggedInUsers] = [
        ...state[AuthKeys.loggedInUsers]?.map(loggedInUser => {
          if (loggedInUser?.ref === action.payload?.ref) {
            return {...loggedInUser, ...action.payload};
          }
          return loggedInUser;
        }),
      ];
    },
    pushAckComponents: (state, action) => {
      state.ackComponents = [...state.ackComponents, action.payload];
    },
    resetAckComponents: (state, _) => {
      state.ackComponents = [];
    },
    setActiveLoggedInUser: (state, action) => {
      state[AuthKeys.loggedInUsers] = [
        ...state[AuthKeys.loggedInUsers]?.map(loggedInUser => {
          if (loggedInUser?.ref === action?.payload) {
            return {...loggedInUser, active: true};
          }
          return {...loggedInUser, active: false};
        }),
      ];
    },
    removeLoggedInUser: (state, action) => {
      state[AuthKeys.loggedInUsers] = [
        ...state[AuthKeys.loggedInUsers]
          .filter(loggedInUser => loggedInUser?.ref !== action.payload)
          .map((loggedInUser, i) => {
            if (i === CommonNumbers.zero) {
              return {...loggedInUser, active: true};
            }
            return loggedInUser;
          }),
      ];
    },
    setUser: (state, action) => {
      state[UserKeys.userType] = action?.payload?.[UserKeys.userType];
      state[UserKeys._id] = action?.payload?.[UserKeys._id];
    },
    setDefaultAccount: (state, action) => {
      state[UserKeys.defaultAccount] = action?.payload;
    },
    resetAuthToken: (state, _) => {
      // I don't know why if I don't set token separately logout not working in rememberMe=false mode
      state.token = CommonStrings.empty;
    },
    resetUserState: (state, _) => {
      state[UserKeys._id] = CommonStrings.empty;
      state[UserKeys.userType] = UserTypes.Unknown;
      state[UserKeys.defaultAccount] = CommonStrings.empty;
    },
  },
});

export const {
  setUserToken,
  setUser,
  setLoggedInUser,
  setDefaultAccount,
  resetAuthToken,
  resetUserState,
  setAuthState,
  pushLoggedInUser,
  removeLoggedInUser,
  setActiveLoggedInUser,
  pushAckComponents,
  setExpiredAfter,
  resetAckComponents,
} = authSlice.actions;

export default authSlice.reducer;
