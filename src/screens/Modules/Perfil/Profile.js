import React, {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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
} from 'native-base';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
// React Native
import {useWindowDimensions, StyleSheet} from 'react-native';
// DateTime Picker
import DateTimePicker from '@react-native-community/datetimepicker';

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
  //Screen dimensionts
  const {width, height} = useWindowDimensions();
  const [tab, setTab] = React.useState('Personal');
  // Date states
  const date = new Date();
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  // Shot Date Picker
  const showDatePicker = () => {
    setShow(true);
    setMode('date');
  };

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async user => {
    const userInfoFB = await firestore()
      .collection('usuarios')
      .where('email', '==', user.email)
      .get();
    setUserInfo(userInfoFB._docs[0]._data);
    //console.log(userInfo)
    return userInfoFB;
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  useEffect(() => {
    //console.log(user)
    if (user !== undefined) {
      //console.log(user)
      const info = getUserInfo(user);
      return info;
    }
  });

  if (initializing) {
    return null;
  }

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
            <VStack space={3} alignItems="center" mt={6}>
              <Input
                placeholder="Nombres"
                defaultValue={userInfo ? userInfo.nombres : 'Nombre de usuario'}
                isDisabled
                // onChangeText={handleChange('nombres')}
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                w="90%"
                borderColor="rgba(71, 91, 216, 1)"
                rounded="4"
                // value={values.nombres}
                _focus={{
                  borderColor: '#475BD8',
                }}
                // mb={2}
                size="xl"
                // onBlur={handleBlur('nombres')}
                InputLeftElement={
                  <Ionicons
                    name="person-outline"
                    // style={styles.email_input}
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
                isDisabled
                // onChangeText={handleChange('nombres')}
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                w="90%"
                borderColor="rgba(71, 91, 216, 1)"
                rounded="4"
                // value={values.nombres}
                _focus={{
                  borderColor: '#475BD8',
                }}
                // mb={2}
                size="xl"
                // onBlur={handleBlur('nombres')}
                InputLeftElement={
                  <Ionicons
                    name="person-outline"
                    // style={styles.email_input}
                    size={32}
                    color="rgba(5, 24, 139, 0.5)"
                    style={styles.iconInput}
                  />
                }
              />
              <Button
                justifyContent="flex-start"
                bgColor="white"
                borderWidth="1"
                w="90%"
                onPress={showDatePicker}
                borderColor="#475BD8"
                // _text={{color: 'rgba(39, 44, 70, 0.5)'}}
                leftIcon={
                  <MaterialIcon
                    name="date-range"
                    color="rgba(5, 24, 139, 0.5)"
                    size={32}
                  />
                }>
                <Text fontSize="lg" color="rgba(39, 44, 70, 0.5)" ml="4">
                  {userInfo ? userInfo.fechaNacimiento : 'FechaNacimiento'}
                </Text>
              </Button>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  // is24Hour={true}
                  display="default"
                  // onChange={() => {
                  //   onChange();
                  //   // handleChange('fechaNacimiento');
                  // }}
                />
              )}
              <Select
                rounder="4"
                w="90%"
                size="xl"
                defaultValue={userInfo ? userInfo.institucion : 'Institución'}
                borderColor="#475BD8"
                style={styles.selectFont}
                placeholder={userInfo ? userInfo.institucion : 'Institución'}
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
              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() => navigation.navigate('Plan Studially')}
                _pressed={{
                  backgroundColor: 'rgba(71, 91, 216, 1)',
                }}
                _text={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Cámbiate a Studially PRO
              </Button>
            </VStack>
          ) : (
            <VStack space={3} alignItems="center" mt={6}>
              <Input
                placeholder="Correo electrónico"
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                defaultValue={user.email}
                isDisabled
                // onChangeText={handleChange('email')}
                // value={values.email}
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
                    margin="0 0 0 1rem"
                  />
                }
              />
              <Input
                placeholder="Contraseña"
                placeholderTextColor="rgba(39, 44, 70, 0.5)"
                // onChangeText={handleChange('password')}
                w="90%"
                // value={values.password}
                _focus={{
                  borderColor: '#475BD8',
                }}
                type="password"
                size="2xl"
                // onBlur={handleBlur('password')}
                borderColor="#475BD8"
                rounded="4"
                InputLeftElement={
                  <MaterialIcon
                    name="lock-outline"
                    style={styles.iconInput}
                    size={32}
                    color="rgba(5, 24, 139, 0.5)"
                  />
                }
              />
              <Button
                bg="rgba(71, 91, 216, 1)"
                w="90%"
                onPress={() => navigation.navigate('Plan Studially')}
                _pressed={{
                  backgroundColor: 'rgba(5, 24, 139, 0.7)',
                }}
                _text={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Cámbiate a Studially PRO
              </Button>
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default Profile;
