import * as React from 'react';
import {useState} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '498493727897-ogfnajq2bkm41ge5dfj76cam855p8hjo.apps.googleusercontent.com',
});

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
  HStack,
  Modal,
} from 'native-base';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
//React Native
import {StyleSheet} from 'react-native';

// DateTime Picker
import DatePicker from 'react-native-date-picker';

// Formik
import {Formik} from 'formik';

import dayjs from 'dayjs';
let weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);

const styles = StyleSheet.create({
  email_input: {
    marginLeft: 8,
  },
  datePicker_text: {
    color: 'rgba(39, 44, 70, 0.6)',
  },
});

//'((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).{7,}\\w+',

const SignUp = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [typePassword, setTypePassword] = useState(true);
  const [typeConfirmPassword, setTypeConfirmPassword] = useState(true);
  const [TerAndCondState, setTerAndCondState] = useState(false);
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*-_().:;/]{8,}$/;
  const toast = useToast();

  const sendEmail = async () => {
    await auth().currentUser.sendEmailVerification({
      handleCodeInApp: true,
      url: 'https://studially-2790e.firebaseapp.com',
    });
  };

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const createUserGoogle = async user => {
    const currentUser = await GoogleSignin.getCurrentUser();
    firestore()
      .collection('usuarios')
      .doc(user.uid)
      .set({
        nombres: currentUser.user.givenName,
        apellidos: currentUser.user.familyName,
        email: user.email,
        fechaNacimiento: dayjs(date).format('YYYY-MM-DD'),
        institucion: '',
        habitos: [],
        fuegos: 0,
        listaAmigos: [],
        finanzas: [],
        metasCumplidas: 0,
        estrellas: 0,
        minutosTotales: 0,
        minutos: [
          {
            categoria: 'Académico',
            minutos: 0,
            minutosSemana: 0,
          },
          {
            categoria: 'Proyectos',
            minutos: 0,
            minutosSemana: 0,
          },
          {
            categoria: 'Personal',
            minutos: 0,
            minutosSemana: 0,
          },
          {
            categoria: 'Trabajo',
            minutos: 0,
            minutosSemana: 0,
          },
          {
            categoria: 'Aprendizaje',
            minutos: 0,
            minutosSemana: 0,
          },
        ],
        minutosHoy: 0,
        minutosHoyDia: '',
        minutosMes: dayjs().month(),
        minutosSemana: dayjs(new Date()).week(),
        since: dayjs().format('YYYY-MM-DD'),
      })
      .then(() => {
        console.log('Google User added!');
      });
  };

  const createUser = values => {
    console.log('Test Regex', passwordRegex.test(values.password));
    if (
      values.nombres === '' ||
      values.apellidos === '' ||
      values.institucion === '' ||
      values.email === '' ||
      values.password === '' ||
      values.confirm_password === ''
    ) {
      toast.show({
        description: 'No debes dejar ningun campo vacío',
        placement: 'top',
        duration: 1000,
      });
    } else if (values.password !== values.confirm_password) {
      toast.show({
        description: 'La contraseña no es igual en la confirmación',
        placement: 'top',
        duration: 1000,
      });
    } else if (passwordRegex.test(values.password) === false) {
      console.log('Test Regex', passwordRegex.test(values.password));
      toast.show({
        description: 'La contraseña no cumple con los parámetros',
        placement: 'top',
        duration: 1000,
      });
    } else {
      auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then(({user}) => {
          console.log('User account created & signed in!');
          //Se agrega a la tabla de usuarios una vez registrado

          firestore()
            .collection('usuarios')
            .doc(user.uid)
            .set({
              nombres: values.nombres,
              apellidos: values.apellidos,
              email: values.email,
              fechaNacimiento: dayjs(date).format('YYYY-MM-DD'),
              institucion: values.institucion,
              habitos: [],
              fuegos: 0,
              listaAmigos: [],
              finanzas: [],
              metasCumplidas: 0,
              estrellas: 0,
              minutosTotales: 0,
              minutos: [
                {
                  categoria: 'Académico',
                  minutos: 0,
                  minutosSemana: 0,
                },
                {
                  categoria: 'Proyectos',
                  minutos: 0,
                  minutosSemana: 0,
                },
                {
                  categoria: 'Personal',
                  minutos: 0,
                  minutosSemana: 0,
                },
                {
                  categoria: 'Trabajo',
                  minutos: 0,
                  minutosSemana: 0,
                },
                {
                  categoria: 'Aprendizaje',
                  minutos: 0,
                  minutosSemana: 0,
                },
              ],
              minutosHoy: 0,
              minutosHoyDia: '',
              minutosMes: dayjs().month(),
              minutosSemana: dayjs(new Date()).week(),
              since: dayjs().format('YYYY-MM-DD'),
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
    }
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
                      setOpenDate(true);
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
                    {dayjs(date).format('DD-MM-YYYY')}
                  </Button>
                  <DatePicker
                    modal
                    open={openDate}
                    date={date}
                    mode="date"
                    locale="es"
                    onConfirm={dateSelected => {
                      setOpenDate(false);
                      setDate(dateSelected);
                    }}
                    onCancel={() => {
                      setOpenDate(false);
                    }}
                  />
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
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center">
                <VStack
                  space={2}
                  alignContent="center"
                  justifyContent="center"
                  alignItems="center">
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
                      />
                    }
                  />
                  {touched.email && errors.email ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.email && errors.email}
                    </Text>
                  ) : null}
                  <HStack
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center">
                    <Input
                      placeholder="Contraseña"
                      placeholderTextColor="rgba(39, 44, 70, 0.5)"
                      onChangeText={handleChange('password')}
                      w="80%"
                      value={values.password}
                      _focus={{
                        borderColor: '#475BD8',
                      }}
                      type={typePassword ? 'password' : 'text'}
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
                      InputRightElement={
                        <MaterialCommunityIcon
                          name="eye"
                          style={styles.email_input}
                          size={25}
                          color="rgba(5, 24, 139, 0.5)"
                          onPress={() => setTypePassword(!typePassword)}
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
                    type={typeConfirmPassword ? 'password' : 'text'}
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
                    InputRightElement={
                      <MaterialCommunityIcon
                        name="eye"
                        style={styles.email_input}
                        size={25}
                        color="rgba(5, 24, 139, 0.5)"
                        onPress={() =>
                          setTypeConfirmPassword(!typeConfirmPassword)
                        }
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
                        onGoogleButtonPress().then(() => {
                          console.log('Signed in with Google!');
                          const user = auth().currentUser;
                          createUserGoogle(user);
                        });
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
                    onPress={() =>
                      onFacebookButtonPress().then(() =>
                        console.log('Signed in with Facebook!'),
                      )
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

export default SignUp;
