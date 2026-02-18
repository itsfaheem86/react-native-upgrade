import {CommonVariableTypes} from '@constants/strings';
import NetInfo from '@react-native-community/netinfo';
import {setConnectionStatus} from '@redux/slices/applicationSlice';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

const NetworkStatusProvider = ({children}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (typeof state.isConnected === CommonVariableTypes.boolean) {
        dispatch(setConnectionStatus(state.isConnected));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return children;
};

export default NetworkStatusProvider;
