import {name as appName} from '@constants/app.json';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {decode} from 'base-64';
import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
global.atob = decode;

// We can move it we need apollo client in some case
// To setup a background handler, call the setBackgroundMessageHandler outside of your application logic as early as possible.
messaging().setBackgroundMessageHandler(async backgroundRemoteMessage => {
  // If you wanna show custom notification only send data and construct here
  // Otherwise don't create a local push notification
  // https://stackoverflow.com/questions/71656727/how-to-recieve-background-notifications-in-notifee-and-fcm
  console.log({
    backgroundRemoteMessage,
  });
});

notifee.onBackgroundEvent(async backgroundLocalEvent => {
  console.log({backgroundLocalEvent});
});

AppRegistry.registerComponent(appName, () => App);
