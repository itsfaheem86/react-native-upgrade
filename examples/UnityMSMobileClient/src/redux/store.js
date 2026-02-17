import {configureStore} from '@reduxjs/toolkit';
import createFlipperDebugger from 'redux-flipper';
import {persistStore} from 'redux-persist';
import {rootReducer} from './rootReducer';

// const persistedReducer = persistReducer(
//   {key: PersistorKeys.root, storage: AsyncStorage},
//   rootReducer,
// );

const middlewares = [];

// If dev enable flipper
if (__DEV__) {
  middlewares.push(createFlipperDebugger());
}

// Use persistedReducer to apply persistor to whole project
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(middlewares),
});

// Persist redux store even after app kill
const persistor = persistStore(store);

export {persistor, store};
