import * as React from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// import {GoogleSignin} from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId:
//     '498493727897-ogfnajq2bkm41ge5dfj76cam855p8hjo.apps.googleusercontent.com',
// });

import uuid from 'react-native-uuid';

//Native Base
import {
  NativeBaseProvider,
  Box,
  VStack,
  Text,
  Select,
  Stack,
  Center,
  Button,
  Checkbox,
  Heading,
  Flex,
  Input,
  useToast,
  Link,
  ScrollView,
} from 'native-base';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
//React Native
import {StyleSheet} from 'react-native';
// DateTime Picker

import DateTimePickerAndroid from '@react-native-community/datetimepicker';

// Formik
import {Formik} from 'formik';

import dayjs from 'dayjs';

const styles = StyleSheet.create({
  email_input: {
    marginLeft: 8,
  },
  datePicker_text: {
    color: 'rgba(39, 44, 70, 0.6)',
  },
});

const SignUp = ({navigation}) => {
  //const {signUpEmail, signUpGoogle} = React.useContext(AuthContext);
  const [date, setDate] = React.useState(new Date());
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState('Fecha de nacimiento');
  const [TerAndCondState, setTerAndCondState] = React.useState(false);
  const toast = useToast();

  const sendEmail = async () => {
    await auth().currentUser.sendEmailVerification({
      handleCodeInApp: true,
      url: 'https://studially-2790e.firebaseapp.com',
    });
  };

  // const onGoogleButtonPress = async () => {
  //   // Get the users ID token
  //   const {idToken} = await GoogleSignin.signIn();

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(googleCredential);
  // };

  // const createUserGoogle = user => {
  //   var userId = uuid.v4();
  //   firestore()
  //     .collection('usuarios')
  //     .doc(userId)
  //     .set({
  //   nombres: values.nombres,
  //   apellidos: values.apellidos,
  //   email: values.email,
  //   fechaNacimiento: values.fechaNacimiento,
  //   institucion: values.institucion,
  //   habitos: [],
  //   fuegos: 0,
  //   listaAmigos: [],
  //   firehabits: [],
  //   finanzas: [],
  //   userId: userId,
  // })
  //     .then(() => {
  //       console.log('Google User added!');
  //     });
  // };

  const createUser = values => {
    auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log('User account created & signed in!');
        //Se agrega a la tabla de usuarios una vez registrado
        var userId = uuid.v4();
        firestore()
          .collection('usuarios')
          .doc(userId)
          .set({
            nombres: values.nombres,
            apellidos: values.apellidos,
            email: values.email,
            fechaNacimiento: values.fechaNacimiento,
            institucion: values.institucion,
            habitos: [],
            fuegos: 0,
            listaAmigos: [],
            finanzas: [],
            estrellas: 0,
            minutos: [
              {
                categoria: 'Académico',
                minutos: 0,
              },
              {
                categoria: 'Proyectos',
                minutos: 0,
              },
              {
                categoria: 'Personal',
                minutos: 0,
              },
              {
                categoria: 'Trabajo',
                minutos: 0,
              },
              {
                categoria: 'Aprendizaje',
                minutos: 0,
              },
            ],
            userId: userId,
          })
          .then(() => {
            console.log('User added!');
          });
        sendEmail();
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          nombres: '',
          apellidos: '',
          institucion: '',
          email: '',
          password: '',
          confirm_password: '',
          fechaNacimiento: '',
          termsAndConditions: '',
        }}
        //validationSchema={SignUpSchema}
        onSubmit={values => {
          console.log(values);
          createUser(values);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <ScrollView bg="#FAFAFA">
            <Box h="100%">
              <Center>
                <Heading size="2xl" mt={5}>
                  Registro
                </Heading>
              </Center>
              <Flex direction="row" justify="flex-start" mt={2} mb={2} ml={6}>
                <Heading size="md">Información personal</Heading>
              </Flex>
              <Flex direction="column" alignItems="center">
                <VStack space={2}>
                  <Input
                    placeholder="Nombres"
                    onChangeText={handleChange('nombres')}
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    w="90%"
                    borderColor="rgba(71, 91, 216, 1)"
                    rounded="4"
                    value={values.nombres}
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    // mb={2}
                    size="xl"
                    onBlur={handleBlur('nombres')}
                    InputLeftElement={
                      <Ionicons
                        name="person-outline"
                        style={styles.email_input}
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                        margin="0 0 0 1rem"
                      />
                    }
                  />
                  {touched.nombres && errors.nombres ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.nombres && errors.nombres}
                    </Text>
                  ) : null}
                  <Input
                    placeholder="Apellidos"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    onChangeText={handleChange('apellidos')}
                    value={values.apellidos}
                    onBlur={handleBlur('apellidos')}
                    w="90%"
                    // mb={2}
                    borderColor="#475BD8"
                    rounded="4"
                    size="xl"
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    InputLeftElement={
                      <Ionicons
                        name="person-outline"
                        style={styles.email_input}
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                      />
                    }
                  />
                  {touched.apellidos && errors.apellidos ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.apellidos && errors.apellidos}
                    </Text>
                  ) : null}
                  <Button
                    justifyContent="flex-start"
                    bgColor="#FFF"
                    borderWidth="1"
                    onPress={() => {
                      setShow(true);
                    }}
                    borderColor="#475BD8"
                    _text={{color: 'rgba(39, 44, 70, 0.5)', fontSize: 'lg'}}
                    leftIcon={
                      <MaterialIcon
                        name="date-range"
                        color="rgba(5, 24, 139, 0.5)"
                        size={32}
                      />
                    }>
                    {text}
                  </Button>
                  {show ? (
                    <DateTimePickerAndroid
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      display="default"
                      onChange={(event, selectedDate) => {
                        if (event.type === 'set') {
                          console.log(dayjs(selectedDate).format('DD/MM/YYYY'));
                          setFieldValue(
                            'fechaNacimiento',
                            dayjs(selectedDate).format('DD/MM/YYYY'),
                          );
                          setText(dayjs(selectedDate).format('DD/MM/YYYY'));
                        }
                        setShow(false);
                        console.log(show);
                      }}
                    />
                  ) : null}
                  <Select
                    placeholder="Institución educativa"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    borderColor="#475BD8"
                    rounded="4"
                    value={values.institucion}
                    onValueChange={handleChange('institucion')}
                    size={'xl'}
                    InputLeftElement={
                      <Ionicons
                        name="school-outline"
                        color="rgba(5, 24, 139, 0.5)"
                        size={36}
                        style={styles.email_input}
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
                  {touched.institucion && errors.institucion ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.institucion && errors.institucion}
                    </Text>
                  ) : null}
                </VStack>
              </Flex>
              <Flex direction="row" justify="flex-start" my={2} ml={6}>
                <Heading size="md">Información de cuenta</Heading>
              </Flex>
              <Flex direction="column" alignItems="center">
                <VStack space={2}>
                  <Input
                    placeholder="Correo electrónico"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    onChangeText={handleChange('email')}
                    value={values.email}
                    w="90%"
                    size="xl"
                    borderColor="#475BD8"
                    rounded="4"
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    InputLeftElement={
                      <MaterialCommunityIcon
                        name="email-outline"
                        style={styles.email_input}
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                        margin="0 0 0 1rem"
                      />
                    }
                  />
                  {touched.email && errors.email ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.email && errors.email}
                    </Text>
                  ) : null}
                  <Input
                    placeholder="Contraseña"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    onChangeText={handleChange('password')}
                    w="90%"
                    value={values.password}
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    type="password"
                    size="xl"
                    onBlur={handleBlur('password')}
                    borderColor="#475BD8"
                    rounded="4"
                    InputLeftElement={
                      <MaterialIcon
                        name="lock-outline"
                        style={styles.email_input}
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                      />
                    }
                  />
                  {touched.password && errors.password ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.password && errors.password}
                    </Text>
                  ) : null}
                  <Input
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="rgba(39, 44, 70, 0.5)"
                    onChangeText={handleChange('confirm_password')}
                    w="90%"
                    value={values.confirm_password}
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    type="password"
                    size="xl"
                    onBlur={handleBlur('confirm_password')}
                    borderColor="#475BD8"
                    rounded="4"
                    InputLeftElement={
                      <MaterialIcon
                        name="lock-outline"
                        style={styles.email_input}
                        size={32}
                        color="rgba(5, 24, 139, 0.5)"
                      />
                    }
                  />
                  {touched.confirm_password && errors.confirm_password ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.confirm_password && errors.confirm_password}
                    </Text>
                  ) : null}
                </VStack>
                {/* </Checkbox> */}
                <Stack direction="row" alignItems="center" ml={4}>
                  <Checkbox
                    value="true"
                    size="sm"
                    colorScheme="info"
                    accessibilityLabel="This is a dummy checkbox"
                    mb={2}
                    onChange={isSelected => {
                      handleChange('termsAndConditions');
                    }}
                  />
                  {/* <Field name="termsAndConditions" as="checkbox" /> */}
                  <Stack
                    direction="row"
                    justify="flex-start"
                    w="56%"
                    mr={20}
                    // mb={2}
                    mt={2}>
                    <Link
                      ml={2}
                      _text={{
                        fontSize: 14,
                        color: '#272C46',
                      }}
                      // w="50%"
                    >
                      Acepto términos & condiciones
                    </Link>
                    <Text fontSize={16} ml={2}>
                      y
                    </Text>
                    <Link
                      ml={2}
                      w="50%"
                      _text={{
                        fontSize: 14,
                        color: '#272C46',
                      }}>
                      Aviso de Privacidad
                    </Link>
                  </Stack>
                </Stack>
                {touched.termsAndConditions &&
                errors.termsAndConditions &&
                TerAndCondState === false ? (
                  <Text color="error.700" fontSize="16" lineHeight="16">
                    {touched.termsAndConditions && errors.termsAndConditions}
                  </Text>
                ) : null}
                <Button
                  w="90%"
                  mt={4}
                  mb={4}
                  h={12}
                  color="#FFF"
                  bg="#475BD8"
                  borderRadius={4}
                  onPress={handleSubmit}
                  _text={{
                    fontSize: 'lg',
                  }}>
                  Crear cuenta
                </Button>
                <Text fontSize={14}>También puedes usar:</Text>
                <Stack direction="row" space={6} mt={2} mb={2}>
                  <Button
                    bg="#FFF"
                    _pressed={{
                      backgroundColor: 'white',
                    }}
                    h={'60px'}
                    rounded="4"
                    w={'60px'}
                    borderWidth="2"
                    onPress={() => {
                      try {
                        console.log('Registro con google');
                        // onGoogleButtonPress().then(() => {
                        //   console.log('Signed in with Google!');
                        //   const user = auth().currentUser;
                        //   createUserGoogle(user);
                        // });
                      } catch (error) {
                        toast.show({
                          description: 'Se ha producido un error',
                          placement: 'top',
                          duration: 1000,
                        });
                      }
                    }}
                    borderColor="#475BD8"
                    leftIcon={
                      <MaterialCommunityIcon
                        name="google"
                        color="#05188B"
                        size={30}
                      />
                    }
                  />
                  <Button
                    bg="#4267B2"
                    h={'60px'}
                    w={'60px'}
                    rounded="4"
                    leftIcon={
                      <FontistoIcon name="facebook" color="#FFFF" size={30} />
                    }
                  />
                </Stack>
                <Flex direction="column" align="center">
                  <Text fontSize={18}>¿Ya tienes una cuenta?</Text>
                  <Link
                    onPress={() => navigation.navigate('SignIn')}
                    mb={5}
                    _text={{
                      fontSize: 18,
                      color: '#272C46',
                    }}>
                    Inicia sesión
                  </Link>
                </Flex>
              </Flex>
            </Box>
          </ScrollView>
        )}
      </Formik>
    </NativeBaseProvider>
  );
};

export default SignUp;
