import {request, PERMISSIONS} from 'react-native-permissions';
import firebaseMessaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Platform} from 'react-native';

export const requestNotificationPermission = async () => {
  if (Platform.constants.Release >= 13) {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (result === 'granted') {
      await getFCMToken();
    }
  } else {
    await getFCMToken();
  }
};

const getFCMToken = async () => {
  try {
    await firebaseMessaging().registerDeviceForRemoteMessages();
    const fcmToken = await firebaseMessaging().getToken();

    // Update backend (e.g. Firestore) with our token for the user
    const email = auth().currentUser.email;
    const query = await firestore()
      .collection('usuarios')
      .where('email', '==', email)
      .get();
    const uid = query.docs[0].data().userId;
    await firestore()
      .doc(`usuarios/${uid}`)
      .update({
        fcmTokens: firestore.FieldValue.arrayUnion(fcmToken),
      });
  } catch (error) {
    console.error(error);
  }
};
