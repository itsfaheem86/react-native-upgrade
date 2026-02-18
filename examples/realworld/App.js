import {persistor, store} from '@redux/store';
import MainLoading from '@ui/components/MainLoading';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import UnityMSApp from './UnityMSApp';

const App = () => {
  return (
    <ReduxProvider store={store}>
      {/* Loading component making flicks on starting  */}
      <PersistGate
        loading={<MainLoading from={App.name} />}
        persistor={persistor}>
        <UnityMSApp />
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
