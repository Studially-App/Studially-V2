/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);

// Note that an async function or a function that returns a Promise
// is required for both subscribers.
async function onMessageReceived(message) {
  console.log(message);
  notifee.displayNotification(JSON.parse(message.data.notifee));
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
notifee.onBackgroundEvent(async _ => {});
