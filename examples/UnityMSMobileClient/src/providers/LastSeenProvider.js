import {AuthKeys, AuthStates, UserKeys} from '@constants/strings';
import {useLastSeenMutation} from '@graphql/actions/auth/mutations';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const LastSeenProvider = ({children}) => {
  const [updateLastSeenMutation] = useLastSeenMutation();
  const auth = useSelector(state => state?.auth);
  const userId = auth?.[UserKeys._id];
  const authState = auth?.[AuthKeys.authState];

  useEffect(() => {
    if (userId && authState === AuthStates.authSuccess) {
      // Need to call it in interval to have more like whatsapp
      updateLastSeenMutation();
    }
  }, [userId, authState]);

  return children;
};

export default LastSeenProvider;
