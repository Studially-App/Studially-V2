import React, { useState, useEffect } from 'react';

// Native Base Components
import {
  NativeBaseProvider,
  ScrollView,
  VStack,
  Select,
  Button,
  Input,
  Avatar,
  Center,
  Text,
  HStack,
  useToast,
  Modal,
} from 'native-base';
import { launchImageLibrary } from 'react-native-image-picker';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// React Native
import {
  useWindowDimensions,
  StyleSheet,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';

// DateTime Picker
import DatePicker from 'react-native-date-picker';

import StudiallyProModal from '../../../components/StudiallyProModal';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import { useUser } from '../../../context/User';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { enableFreeze } from 'react-native-screens';
import {SECRET_KEY} from '@env';
import axios from 'axios'; 

const styles = StyleSheet.create({
  iconInput: {
    marginLeft: 12,
    marginRight: 16,
  },
  selectFont: {
    fontSize: 18,
    color: 'rgba(39, 44, 70, 0.5)',
  },
});

const Profile = ({ navigation }) => {
  const { user, userInfo, userTier } = useUser();
  const toast = useToast();

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-_\[\]{}\¡\/´,;.])[A-Za-z\d!@#$%^&*\-_\[\]{}\¡\/´,;.]{8,}$/;

  //Screen dimensionts
  const { width, height } = useWindowDimensions();
  const [tab, setTab] = React.useState('Personal');

  console.log(userInfo.fechaNacimiento);
  // Date states
  let userDate;

  if (userInfo && userInfo.fechaNacimiento) {
    userDate = moment(userInfo.fechaNacimiento, 'DD-MM-YYYY').tz("America/Mexico_City");
  } else {
    userDate = moment().tz("America/Mexico_City");
  }  

  // Al inicializar el estado
  const [date, setDate] = useState(userDate);
  const [openDate, setOpenDate] = useState(false);

  // State edit Info
  const [edit, setEdit] = useState(true);

  // State edit Password
  const [editPassword, setEditPassword] = useState(false);

  // State information to edit
  const [name, setName] = useState(userInfo ? userInfo.nombres : 'Nombre');
  const [lastName, setLastName] = useState(
    userInfo ? userInfo.apellidos : 'Apellido',
  );
  const [school, setSchool] = useState(
    userInfo ? userInfo.institucion : 'Institución',
  );
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userInfo
      ? userInfo.profilePic
      : 'https://firebasestorage.googleapis.com/v0/b/studially-2790e.appspot.com/o/logos%2Fprofile.jpeg?alt=media&token=665d38db-7c24-447d-9dae-a04c0b514370',
  );
  // initialize Firebase Storage
  const storageRef = storage().ref();

  // State for password change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [openPassword, setOpenPassword] = useState(false);
  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);

  console.log(userInfo.fechaNacimiento);

  const saveInfo = () => {
    
    
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          nombres: name,
          apellidos: lastName,
          institucion: school,
          fechaNacimiento: moment.tz(date, 'America/Mexico_City').format('DD-MM-YYYY'),
        })
        .then(() => {
          console.log('User Information updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const changePass = async () => {
    if (passwordRegex.test(newPass) === false) {
      console.log('Test Regex', passwordRegex.test(newPass));
      toast.show({
        description: 'La nueva contraseña no cumple con los parámetros',
        placement: 'top',
        duration: 2000,
      });
    } else {
      try {
        const user = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(
          user.email,
          currentPass,
        );

        // Reauthenticate the user with their current password
        await user.reauthenticateWithCredential(credential);

        // Change the user's password
        await user.updatePassword(newPass);

        toast.show({
          description: 'Tu contraseña se cambió exitosamente',
          placement: 'top',
          duration: 1000,
        });
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          toast.show({
            description: 'Contraseña actual incorrecta',
            placement: 'top',
            duration: 2000,
          });
        }
        console.log('Error', error.message);
      }
    }
    setEditPassword(false);
  };

  const requestCameraRollPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission to access photo library',
          message: 'This app needs permission to access your photo library.',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  const handleChoosePicture = async () => {
    console.log('Cambiar foto');
    const granted = await requestCameraRollPermission();
    if (!granted) {
      return;
    }

    let options = {
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        uploadImage(response.assets[0].uri)
          .then(() => {
            console.log('Image uploaded successfully');
          })
          .catch(error => {
            console.log('Error uploading image: ', error);
          });
      }
    });
  };

  const uploadImage = async uri => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a reference to the image file in Firebase Storage
    const ref = storageRef.child(`profile-images/${user.uid}/profile.jpg`);

    // Upload the image to Firebase Storage
    const uploadTaskSnapshot = await ref.put(blob);

    // Get the download URL of the image
    const downloadURL = await ref.getDownloadURL();

    setProfilePictureUrl(downloadURL);

    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          profilePic: downloadURL,
        })
        .then(() => {
          console.log('User photo updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  /*const openSubscriptionPage = async () => {
    const result = await functions().httpsCallable('customerPortal')({
      returnUrl: 'https://studially.com',
    });
    result.data.url && Linking.openURL(result.data.url);
  };*/

  const openSubscriptionPage = async (userEmail) => {
    try {
      const response = await axios.get(`https://api.stripe.com/v1/customers/search?query=email:"${user.email}"`, {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`
        }
      });
  
      if (response.status === 200 && response.data && response.data.data.length > 0) {
        const customerId = response.data.data[0].id;
  
        const responseSession = await axios.post(`https://api.stripe.com/v1/billing_portal/sessions`, 
          { customer: customerId }, 
          {
            headers: {
              Authorization: `Bearer ${SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        );
  
        if (responseSession.status === 200 && responseSession.data) {
          Linking.openURL(responseSession.data.url);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  return (
    <NativeBaseProvider>
      <ScrollView h={height} w={width} bg="#FAFAFA">
        <Center my={6}>
          <Avatar
            bg="green.500"
            size="xl"
            source={{
              uri: profilePictureUrl,
            }}></Avatar>
          <HStack alignItems="center">
            <Text
              color="rgba(5, 24, 139, 0.5)"
              onPress={() => handleChoosePicture()}>
              Editar foto de perfil
            </Text>
            <MaterialCommunityIcon
              name="account-edit-outline"
              size={32}
              color="rgba(5, 24, 139, 0.5)"
              onPress={() => handleChoosePicture()}
            />
          </HStack>
        </Center>
        <HStack justifyContent="center">
          {tab === 'Personal' ? (
            <>
              <Button onPress={() => setTab('Personal')} bg="#475BD8" w={'40%'}>
                <Text fontSize="lg" color="white">
                  Personal
                </Text>
              </Button>
              <Button onPress={() => setTab('Cuenta')} bg="white" w={'40%'}>
                <Text fontSize="lg" color="#475BD8">
                  Cuenta
                </Text>
              </Button>
            </>
          ) : (
            <>
              <Button onPress={() => setTab('Personal')} bg="white" w={'40%'}>
                <Text fontSize="lg" color="#475BD8">
                  Personal
                </Text>
              </Button>
              <Button onPress={() => setTab('Cuenta')} bg="#475BD8" w={'40%'}>
                <Text fontSize="lg" color="white">
                  Cuenta
                </Text>
              </Button>
            </>
          )}
        </HStack>
        <VStack>
          {tab === 'Personal' ? (
            <VStack space={3} alignItems="flex-start" mt={6} ml={10}>
              <HStack
                alignItems="center"
                style={{ alignSelf: 'flex-end', marginRight: '10%' }}>
                <Text
                  color="rgba(5, 24, 139, 0.5)"
                  onPress={() => setEdit(false)}>
                  Editar información
                </Text>
                <MaterialCommunityIcon
                  name="account-edit-outline"
                  size={32}
                  color="rgba(5, 24, 139, 0.5)"
                  onPress={() => setEdit(false)}
                />
              </HStack>

              <Input
                placeholder="Nombres"
                defaultValue={userInfo ? userInfo.nombres : 'Nombre de usuario'}
                isDisabled={edit}
                onChangeText={text => setName(text)}
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                w="90%"
                borderColor="rgba(71, 91, 216, 1)"
                rounded="4"
                _focus={{
                  borderColor: '#475BD8',
                }}
                size="xl"
                InputLeftElement={
                  <Ionicons
                    name="person-outline"
                    size={32}
                    color="rgba(5, 24, 139, 0.5)"
                    style={styles.iconInput}
                  />
                }
              />
              <Input
                placeholder="Apellidos"
                defaultValue={
                  userInfo ? userInfo.apellidos : 'Apellido de usuario'
                }
                isDisabled={edit}
                onChangeText={text => setLastName(text)}
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                w="90%"
                borderColor="rgba(71, 91, 216, 1)"
                rounded="4"
                _focus={{
                  borderColor: '#475BD8',
                }}
                size="xl"
                InputLeftElement={
                  <Ionicons
                    name="person-outline"
                    size={32}
                    color="rgba(5, 24, 139, 0.5)"
                    style={styles.iconInput}
                  />
                }
              />

              <DatePicker
                modal
                open={openDate}
                date={date.toDate()}
                mode="date"
                locale="es"
                onConfirm={dateSelected => {
                  setOpenDate(false);
                  setDate(moment(dateSelected));
                }}
                onCancel={() => {
                  setOpenDate(false);
                }}
              />
              <Text textAlign="left">Fecha de Nacimiento</Text>
              <Button
                justifyContent="flex-start"
                bgColor="white"
                borderWidth="1"
                w="90%"
                isDisabled={edit}
                onPress={() => {
                  setOpenDate(true);
                }}
                borderColor="#475BD8"
                leftIcon={
                  <MaterialIcon
                    name="date-range"
                    color="rgba(5, 24, 139, 0.5)"
                    size={32}
                  />
                }>
                <Text fontSize="lg" color="rgba(39, 44, 70, 0.5)" ml="4">
                  {date.format('DD/MM/YYYY')}
                </Text>
              </Button>

              <Select
                rounder="4"
                w="90%"
                size="xl"
                isDisabled={edit}
                defaultValue={userInfo ? userInfo.institucion : 'Institución'}
                borderColor="#475BD8"
                style={styles.selectFont}
                placeholder={userInfo ? userInfo.institucion : 'Institución'}
                onValueChange={itemValue => setSchool(itemValue)}
                InputLeftElement={
                  <Ionicons
                    name="school-outline"
                    color="rgba(5, 24, 139, 0.5)"
                    size={32}
                    style={styles.iconInput}
                  />
                }>
                <Select.Item label="Anáhuac" value="Anáhuac" />
                <Select.Item label="EBC" value="EBC" />
                <Select.Item label="Ibero" value="Ibero" />
                <Select.Item label="IPN" value="IPN" />
                <Select.Item label="ITAM" value="ITAM" />
                <Select.Item label="ITESM" value="ITESM" />
                <Select.Item label="Justo Sierra" value="Justo Sierra" />
                <Select.Item label="Panamericana" value="Panamericana" />
                <Select.Item label="Tec Milenio" value="Tec Milenio" />
                <Select.Item label="ULA" value="ULA" />
                <Select.Item label="UNAM" value="UNAM" />
                <Select.Item
                  label="Universidad La Salle"
                  value="Universidad La Salle"
                />
                <Select.Item label="UVM" value="UVM" />
              </Select>
              {edit === false ? (
                <Button
                  bg="rgba(71, 91, 216, 1)"
                  w="90%"
                  onPress={() => {
                    saveInfo();
                    setEdit(true);
                  }}
                  _pressed={{
                    backgroundColor: 'rgba(5, 24, 139, 0.7)',
                  }}
                  _text={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Guardar
                </Button>
              ) : null}
              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() =>
                  userTier !== 'premium'
                    ? setProModalVisibility(true)
                    : openSubscriptionPage()
                }
                _pressed={{
                  backgroundColor: 'rgba(71, 91, 216, 1)',
                }}
                _text={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {userTier !== 'premium'
                  ? 'Cámbiate a Studially PRO'
                  : 'Administrar'}
              </Button>
            </VStack>
          ) : (
            <VStack space={3} alignItems="center" mt={6}>
              <Input
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                defaultValue={user.email}
                isDisabled
                w="90%"
                size="2xl"
                borderColor="#475BD8"
                rounded="4"
                _focus={{
                  borderColor: '#475BD8',
                }}
                InputLeftElement={
                  <MaterialCommunityIcon
                    name="email-outline"
                    style={styles.iconInput}
                    size={32}
                    color="rgba(5, 24, 139, 0.5)"
                  />
                }
              />
              <HStack alignItems="center">
                <Text
                  color="rgba(5, 24, 139, 0.5)"
                  onPress={() => setEditPassword(true)}>
                  Cambiar contraseña
                </Text>
                <MaterialCommunityIcon
                  name="account-edit-outline"
                  size={32}
                  color="rgba(5, 24, 139, 0.5)"
                  onPress={() => setEditPassword(true)}
                />
              </HStack>

              {editPassword === true ? (
                <>
                  <Input
                    placeholder="Contraseña actual"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    onChangeText={text => setCurrentPass(text)}
                    w="80%"
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    type={'password'}
                    size="xl"
                    borderColor="#475BD8"
                    rounded="4"
                    InputLeftElement={
                      <MaterialIcon
                        name="lock-outline"
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                      />
                    }
                  />

                  <HStack alignItems="center">
                    <Input
                      placeholder="Contraseña nueva"
                      placeholderTextColor="rgba(39, 44, 70, 0.5)"
                      onChangeText={text => setNewPass(text)}
                      w="80%"
                      _focus={{
                        borderColor: '#475BD8',
                      }}
                      type={'password'}
                      size="xl"
                      borderColor="#475BD8"
                      rounded="4"
                      InputLeftElement={
                        <MaterialIcon
                          name="lock-outline"
                          size={32}
                          color="rgba(5, 24, 139, 0.5)"
                        />
                      }
                    />
                    <MaterialCommunityIcon
                      name="information-outline"
                      style={styles.email_input}
                      size={32}
                      color="rgba(5, 24, 139, 0.5)"
                      onPress={() => setOpenPassword(true)}
                    />
                  </HStack>

                  <Button
                    bg="rgba(71, 91, 216, 1)"
                    w="80%"
                    onPress={() => {
                      changePass();
                    }}
                    _pressed={{
                      backgroundColor: 'rgba(5, 24, 139, 0.7)',
                    }}
                    _text={{
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    Cambiar contraseña
                  </Button>
                </>
              ) : null}

              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() =>
                  userTier !== 'premium'
                    ? setProModalVisibility(true)
                    : openSubscriptionPage()
                }
                _pressed={{
                  backgroundColor: 'rgba(5, 24, 139, 0.7)',
                }}
                _text={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {userTier !== 'premium'
                  ? 'Cámbiate a Studially PRO'
                  : 'Administrar'}
              </Button>
            </VStack>
          )}
        </VStack>
      </ScrollView>
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
      <Modal isOpen={openPassword} onClose={() => setOpenPassword(false)}>
        <Modal.Content maxH="212">
          <Modal.CloseButton />
          <Modal.Header>Parámetros de contraseña</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Text>- Al menos 8 caracteres</Text>
              <Text>- Al menos 1 Mayúscula</Text>
              <Text>- Al menos 1 Minúscula</Text>
              <Text>- Al menos 1 Número</Text>
              <Text>- Al menos 1 Caracter Especial</Text>
              <Text>!@#$%^&*-_().:;/</Text>
            </ScrollView>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

export default Profile;
