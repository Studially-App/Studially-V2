import * as React from 'react';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '498493727897-ogfnajq2bkm41ge5dfj76cam855p8hjo.apps.googleusercontent.com',
});

import {
  NativeBaseProvider,
  VStack,
  Text,
  Stack,
  Center,
  Heading,
  ScrollView,
  Button,
  Flex,
  Image,
  Input,
  Link,
  useToast,
} from 'native-base';
import StudiallyLogo from '../../assets/images/Studially-logo.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
// import Font
import { StyleSheet, Dimensions } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  email_input: {
    marginLeft: 8,
  },
});

const SignInSchema = Yup.object({
  email: Yup.string().email('Correo invalido').required('Requerido'),
  password: Yup.string().required('Ingrese la contraseña'),
});

const SignIn = ({ navigation }) => {
  const toast = useToast();

  const loginUser = values => {
    console.log(values);
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log('User signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        //console.error(error);
        toast.show({
          description: 'Inicio de sesión inválido',
        });
      });
  };

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={SignInSchema}
        onSubmit={values => {
          loginUser(values);
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <SafeAreaView style={{ backgroundColor: '#FAFAFA' }} >
            <ScrollView h="100%" bg="#FAFAFA">
              <VStack h="100%" space={4} justifyContent="flex-start">
                <Center>
                  <Image
                    source={StudiallyLogo}
                    alt="StudiallyLogo"
                    style={{
                      marginTop: 8,
                      marginBottom: 4,
                      width: windowWidth, // Utiliza el ancho de la ventana
                      height: windowHeight * 0.2, // Puedes ajustar este valor según tus necesidades
                    }}
                    resizeMode='center' // Elige el modo que mejor se adapte a tus necesidades
                  />
                </Center>
                <Flex direction="row" justify="center" bg="#FAFAFA" pb={6}>
                  <Heading size="xl" color="#272C46">
                    ¡Bienvenido de nuevo!
                  </Heading>
                </Flex>
                <VStack space={2} alignItems="center">
                  <Input
                    placeholder="Correo electrónico"
                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                    onChangeText={handleChange('email')}
                    value={values.email}
                    onBlur={handleBlur('email')}
                    w="90%"
                    borderColor="rgba(71, 91, 216, 1)"
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    type="email"
                    size="2xl"
                    InputLeftElement={
                      <MaterialCommunityIcon
                        name="email-outline"
                        style={styles.email_input}
                        size={28}
                        color="rgba(5, 24, 139, 0.8)"
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
                    placeholderTextColor="rgba(39, 44, 70, 0.8)"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    w="90%"
                    _focus={{
                      borderColor: '#475BD8',
                    }}
                    type="password"
                    borderColor="rgba(71, 91, 216, 1)"
                    size="2xl"
                    InputLeftElement={
                      <MaterialIcon
                        name="lock-outline"
                        style={styles.email_input}
                        size={28}
                        color="rgba(5, 24, 139, 0.8)"
                      />
                    }
                  />
                  {touched.password && errors.password ? (
                    <Text color="error.700" fontSize="16" lineHeight="16">
                      {touched.password && errors.password}
                    </Text>
                  ) : null}
                </VStack>
                <Center>
                  <Button
                    h={12}
                    color="#FFF"
                    bg="#475BD8"
                    borderRadius={4}
                    _pressed={{ bg: '#475BD8' }}
                    type="submit"
                    _text={{
                      fontSize: 'xl',
                    }}
                    onPress={handleSubmit}
                    w="90%">
                    Iniciar sesión
                  </Button>
                </Center>
                <Center>
                  <Text fontSize={18}>O inicia con:</Text>
                  <Stack direction="row" space={6} mt={2} mb={4}>
                    <Button
                      bg="#FFF"
                      _pressed={{
                        backgroundColor: '#c2c2c2',
                      }}
                      h={'60px'}
                      rounded="4"
                      w={'60px'}
                      borderWidth="2"
                      borderColor="#475BD8"
                      onPress={() => {
                        try {
                          console.log('Registro con google');
                          onGoogleButtonPress().then(() => {
                            console.log('Signed in with Google!');
                          });
                        } catch (error) {
                          toast.show({
                            description: 'Se ha producido un error',
                            placement: 'top',
                            duration: 1000,
                          });
                        }
                      }}
                      leftIcon={
                        <MaterialCommunityIcon
                          name="google"
                          color="#05188B"
                          size={30}
                        />
                      }
                    />
                    {/* <Button
                    bg="#4267B2"
                    h={'60px'}
                    w={'60px'}
                    rounded="4"
                    leftIcon={
                      <FontistoIcon name="facebook" color="#FFFF" size={30} />
                    }
                  /> */}
                  </Stack>
                  <Flex direction="column" align="center">
                    <Link
                      mb={2}
                      onPress={() => {
                        console.log('Reset');
                        navigation.navigate('ResetPassword');
                      }}
                      _text={{
                        fontSize: 22,
                        color: '#272C46',
                      }}>
                      Olvidé mi contraseña
                    </Link>
                    <Link
                      onPress={() => navigation.navigate('SignUp')}
                      _text={{
                        fontSize: 22,
                        color: '#272C46',
                      }}>
                      Crear cuenta
                    </Link>
                  </Flex>
                </Center>
              </VStack>
            </ScrollView>
          </SafeAreaView>
        )}
      </Formik>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

export default SignIn;
