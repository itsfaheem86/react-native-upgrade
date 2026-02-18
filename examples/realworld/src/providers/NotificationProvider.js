import {AuthKeys, AuthStates, UserKeys} from '@constants/strings';
import {useUpdateMessageTokenMutation} from '@graphql/actions/auth/mutations';
import messaging from '@react-native-firebase/messaging';
import {
  checkAndRequestLocalPushNotification,
  checkAndRequestRemoteMessageUserPermission,
  displayNotifeeNotification,
  getPushNotificationDeviceToken,
} from '@utils';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const NotificationProvider = ({children}) => {
  const [updateMessageTokenMutation] = useUpdateMessageTokenMutation();
  const auth = useSelector(state => state?.auth);
  const userId = auth?.[UserKeys._id];
  const authState = auth?.[AuthKeys.authState];

  useEffect(() => {
    // Request remote push notification
    checkAndRequestRemoteMessageUserPermission();
    // Request local push notification
    checkAndRequestLocalPushNotification();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log({component: NotificationProvider.name, remoteMessage});
      displayNotifeeNotification(remoteMessage.notification);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId && authState === AuthStates.authSuccess) {
      getPushNotificationDeviceToken().then(token => {
        console.log({component: NotificationProvider.name, token, userId});
        if (token)
          updateMessageTokenMutation({
            variables: {
              token,
            },
          });
      });
      return messaging().onTokenRefresh(refreshedToken => {
        console.log({
          component: NotificationProvider.name,
          refreshedToken,
          userId,
        });
        if (refreshedToken)
          updateMessageTokenMutation({
            variables: {
              token: refreshedToken,
            },
          });
      });
    }
  }, [userId, authState]);

  return children;
};

export default NotificationProvider;
