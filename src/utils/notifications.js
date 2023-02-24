import {request, PERMISSIONS} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export const requestNotificationPermission = async () => {
  const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
  if (result === 'granted') {
    await getFCMToken();
  }
};

const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();

    // Update backend (e.g. Firestore) with our token for the user
    const uid = auth().currentUser.uid;
    await firestore()
      .doc(`usuarios/${uid}`)
      .update({
        fcmTokens: FirebaseFirestoreTypes.FieldValue.arrayUnion(fcmToken),
      });
  } catch (error) {}
};
