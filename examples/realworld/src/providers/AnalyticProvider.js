import {firebase} from '@react-native-firebase/analytics';
import {useEffect} from 'react';

const AnalyticProvider = props => {
  const {children} = props;
  useEffect(() => {
    firebase
      .analytics()
      .setAnalyticsCollectionEnabled(!__DEV__)
      .then(_ => {
        console.log({component: AnalyticProvider.name, enabled: !__DEV__});
      })
      .catch(reason => {
        console.log({component: AnalyticProvider.name, reason});
      });
  }, []);
  return children;
};

export default AnalyticProvider;
