import * as React from 'react';
import {
  NativeBaseProvider,
  Box,
  HStack,
  Text,
  View,
  Center,
  Heading,
  Button,
  Flex,
  Input,
  Modal,
  Image,
  useToast,
} from 'native-base';
import StudiallyLogo from '../../assets/images/Studially-logo.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
// Formik
import { Formik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const styles = StyleSheet.create({
  email_input: {
    marginLeft: 8,
  },
});

const ResetPasswordSchema = Yup.object({
  correo: Yup.string().email('Correo invalido').required('Requerido'),
});

const ResetPassword = ({ navigation }) => {
  const [modal, setModal] = React.useState(false);
  const toast = useToast();

  const handlePasswordReset = async correo => {
    try {
      await auth().sendPasswordResetEmail(correo);

      console.log(
        'Success',
        'A password reset email has been sent to your email address.',
      );
      setModal(true);
    } catch (error) {
      console.log('Error', error.message);
      if (error.code === 'auth/user-not-found') {
        toast.show({
          description: 'No existe una cuenta con ese correo electrónico',
          placement: 'top',
          duration: 2000,
        });
      }
    }
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          correo: '',
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values, actions) => {
          console.log(values);
          handlePasswordReset(values.correo);
        }}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <SafeAreaView style={{ backgroundColor: '#FAFAFA' }} >
            <Box h="100%">
              <Box>
                <HStack justifyContent="flex-start" alignItems="center" w="100%">
                  <HStack
                    alignItems="flex-start"
                    space={1}
                    justifyContent="flex-start"
                    w={'10%'}>
                    <Button
                      onPress={() => navigation.navigate('SignIn')}
                      bg="transparent"
                      _pressed={{ bg: 'transparent' }}
                      rounded="4"
                      leftIcon={
                        <MaterialIcon
                          name="keyboard-backspace"
                          color="#272C46"
                          size={30}
                        />
                      }
                    />
                  </HStack>
                  <HStack
                    alignItems="flex-start"
                    space={6}
                    justifyContent="center"
                    w={'90%'}>
                    <Image
                      source={StudiallyLogo}
                      alt="StudiallyLogo"
                      // h="%"
                      size="xs"
                      w={150}
                    />
                  </HStack>

                </HStack>
              </Box>
              <Flex
                direction="column"
                justify="flex-start"
                mt={2}
                align="center"
                h="100%">
                <Heading size="lg" color="#272C46" mt={4} mb={16}>
                  ¿Olvidaste tu contraseña?
                </Heading>
                <Flex direction="column" align="flex-start">
                  <Text fontSize="lg" color="#272C46">
                    Ingresa el correo electrónico asociado a
                  </Text>
                  <Text fontSize="lg" color="#272C46" w="70%">
                    tu cuenta Studially
                  </Text>
                </Flex>

                <Input
                  placeholder="Correo electrónico"
                  placeholderTextColor="rgba(39, 44, 70, 0.8)"
                  onChangeText={handleChange('correo')}
                  value={values.correo}
                  onBlur={handleBlur('correo')}
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
                <Button
                  w="90%"
                  mt={6}
                  mb={4}
                  h={hp('6.5%')}
                  onPress={() => handleSubmit()}
                  // onPress={handleSubmit}
                  color="#FFF"
                  bg="#475BD8"
                  _pressed={{ bg: '#475BD8' }}
                  borderRadius={4}
                  _text={{
                    fontSize: wp('4%'),
                  }}>
                  Enviar correo
                </Button>

                <Modal
                  isOpen={modal}
                  size="xl"
                  onClose={() => {
                    setModal(false);
                  }}>
                  <Modal.Content h="24%">
                    <Center>
                      <Modal.Header
                        borderColor="#FAFAFA"
                        _text={{
                          fontSize: 26,
                        }}>
                        Recuperar cuenta
                      </Modal.Header>
                    </Center>
                    <Modal.Body>
                      <Center>
                        <Text fontSize="lg">
                          Se ha enviado un link a tu correo
                        </Text>
                        <Text fontSize="lg">para recuperar tu cuenta</Text>
                      </Center>
                    </Modal.Body>
                    <Center>
                      <Modal.Footer bg="#FAFAFA">
                        <Button
                          bg="#475BD8"
                          rounded="4"
                          _pressed={{ bg: '#475BD8' }}
                          onPress={() => setModal(false)}>
                          Entendido
                        </Button>
                      </Modal.Footer>
                    </Center>
                  </Modal.Content>
                </Modal>
              </Flex>
            </Box>
            </SafeAreaView>
          </View>
        )}
      </Formik>
    </NativeBaseProvider>
  );
};

export default ResetPassword;
