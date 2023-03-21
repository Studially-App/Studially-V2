import React, {useState} from 'react';

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
} from 'native-base';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// React Native
import {useWindowDimensions, StyleSheet, Linking} from 'react-native';

// DateTime Picker
import DatePicker from 'react-native-date-picker';

import dayjs from 'dayjs';
import {useUser} from '../../../context/User';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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

const Profile = ({navigation}) => {

  const {user, userInfo, userTier} = useUser();
  const toast = useToast();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-_\[\]{}\¡\/´,;.])[A-Za-z\d!@#$%^&*\-_\[\]{}\¡\/´,;.]{8,}$/;

  //Screen dimensionts
  const {width, height} = useWindowDimensions();
  const [tab, setTab] = React.useState('Personal');
  // Date states
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [firstDate, setFirstDate] = useState(true);

  // State edit Info
  const [edit, setEdit] = useState(true);

  // State edit Password
  const [editPassword, setEditPassword] = useState(false);

  // State information to edit
  const [name, setName] = useState(userInfo ? userInfo.nombres : 'Nombre');
  const [lastName, setLastName] = useState(userInfo ? userInfo.apellidos : 'Apellido');
  const [school, setSchool] = useState(userInfo ? userInfo.institucion : 'Institución');

  // State for password change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  
  const saveInfo = () => {
    console.log('Name & lastName & date & school', name, lastName, dayjs(date).format('DD-MM-YYYY'), school);
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          nombres: name,
          apellidos: lastName,
          institucion: school,
          fechaNacimiento: dayjs(date).format('DD-MM-YYYY')
        })
        .then(() => {
          console.log('User Information updated!');
        });
    } catch (error) {
      console.log(error);
    }
  }

  const changePass = async () => {
    if (passwordRegex.test(newPass) === false) {
      console.log('Test Regex', passwordRegex.test(newPass));
      toast.show({
        description: 'La nueva contraseña no cumple con los parámetros',
        placement: 'top',
        duration: 2000,
      });
    }
    else{
      try {
        const user = auth().currentUser;
        const credential = auth.EmailAuthProvider.credential(user.email, currentPass);
  
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
  }

  const openSubscriptionPage = async () => {
    const result = await functions().httpsCallable('customerPortal')({
      returnUrl: 'https://studially.com',
    });
    result.data.url && Linking.openURL(result.data.url);
  };

  return (
    <NativeBaseProvider>
      <ScrollView h={height} w={width} bg="#FAFAFA">
        <Center my={6}>
          <Avatar
            bg="green.500"
            size="xl"
            source={{
              uri: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
            }}>
            PP
          </Avatar>
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
              <HStack alignItems="center" style={{alignSelf:"flex-end", marginRight:"10%"}} >
                <Text color="rgba(5, 24, 139, 0.5)" onPress={() => setEdit(false)}>Editar información</Text>
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
                date={date}
                mode="date"
                locale="es"
                onConfirm={dateSelected => {
                  setOpenDate(false);
                  setDate(dateSelected);
                  setFirstDate(false);
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
                  {userInfo && firstDate
                    ? dayjs(userInfo.fechaNacimiento).format('DD-MM-YYYY')
                    : dayjs(date).format('DD-MM-YYYY')}
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
              {edit === false ? 
              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() =>{
                  saveInfo();
                  setEdit(true);
                }
                }
                _pressed={{
                  backgroundColor: 'rgba(5, 24, 139, 0.7)',
                }}
                _text={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Guardar
              </Button>
              : null
              }
              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() =>
                  userTier !== 'premium'
                    ? navigation.navigate('Studially Pro')
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
                  : 'Administrar subscripción'}
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
              <HStack alignItems="center" >
                <Text color="rgba(5, 24, 139, 0.5)" onPress={() => setEditPassword(true)}>Cambiar contraseña</Text>
                <MaterialCommunityIcon
                  name="account-edit-outline"
                  size={32}
                  color="rgba(5, 24, 139, 0.5)"
                  onPress={() => setEditPassword(true)}
                />
              </HStack>

              {editPassword === true ? 
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

                <Button
                  bg="rgba(71, 91, 216, 1)"
                  w="80%"
                  onPress={() =>{
                    changePass();
                  }
                  }
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
              : null
              }

              

              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() =>
                  userTier !== 'premium'
                    ? navigation.navigate('Studially Pro')
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
                  : 'Administrar subscripción'}
              </Button>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Profile;
