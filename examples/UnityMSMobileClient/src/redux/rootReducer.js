import {AuthKeys, PersistorKeys, UserKeys} from '@constants/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import application from '@redux/slices/applicationSlice';
import auth from '@redux/slices/authSlice';
import {combineReducers} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';

// Persist application related redux data
const applicationPersistedReducer = persistReducer(
  {key: PersistorKeys.application, storage: AsyncStorage},
  application,
);

const authPersistedReducer = persistReducer(
  {
    key: PersistorKeys.auth,
    storage: AsyncStorage,
    whitelist: [
      UserKeys.userType,
      UserKeys.defaultAccount,
      UserKeys._id,
      AuthKeys.loggedInUsers,
    ],
  },
  auth,
);

const rootReducer = combineReducers({
  application: applicationPersistedReducer,
  auth: authPersistedReducer,
});

export {rootReducer};
