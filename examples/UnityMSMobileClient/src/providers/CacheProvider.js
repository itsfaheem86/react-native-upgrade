import {persistor} from '@graphql/cache';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const CacheProvider = props => {
  const {children} = props;
  const isConnected = useSelector(state => state?.application?.isConnected);
  useEffect(() => {
    if (!isConnected) {
      persistor.restore().catch(e => {
        console.log({component: CacheProvider.name, e});
      });
    }
  }, [isConnected]);
  return children;
};

export default CacheProvider;
