import {request, PERMISSIONS} from 'react-native-permissions';
import firebaseMessaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';

export const requestNotificationPermission = async () => {
  if (Platform.constants.Release >= 13) {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (result === 'granted') {
      await getFCMToken();
    }
  } else {
    await getFCMToken();
  }
  await notifee.createChannel({
    id: 'default',
    name: 'Recordatorio de habitos',
    lights: false,
    vibration: true,
    importance: AndroidImportance.DEFAULT,
  });
};

const getFCMToken = async () => {
  try {
    await firebaseMessaging().registerDeviceForRemoteMessages();
    const fcmToken = await firebaseMessaging().getToken();

    // Update backend (e.g. Firestore) with our token for the user
    const uid = auth().currentUser.uid;
    await firestore()
      .doc(`usuarios/${uid}`)
      .update({
        fcmTokens: firestore.FieldValue.arrayUnion(fcmToken),
      });
  } catch (error) {
    console.error(error);
  }
};

export const subscribeToTopic = async topic => {
  try {
    await firebaseMessaging().subscribeToTopic(topic);
  } catch (error) {
    console.error(error);
  }
};

export const unsubscribeFromTopic = async topic => {
  try {
    await firebaseMessaging().unsubscribeFromTopic(topic);
  } catch (error) {
    console.error(error);
  }
};
