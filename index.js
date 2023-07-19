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
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
  notifee.displayNotification({
    id: message.messageId,
    title: message.notification.title,
    body: message.notification.body,
    data: message.data,
    android: {
      channelId: channelId,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      critical: true,
      sound: 'local.wav',
    },
  });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().onNotificationOpenedApp(onMessageReceived);
notifee.onBackgroundEvent(async _ => {});
