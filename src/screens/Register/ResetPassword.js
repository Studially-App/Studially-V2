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
} from 'native-base';
import StudiallyLogo from '../../assets/images/Studially-logo.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet} from 'react-native';
// Formik
import {Formik} from 'formik';
import * as Yup from 'yup';

const styles = StyleSheet.create({
  email_input: {
    marginLeft: 8,
  },
});

const ResetPasswordSchema = Yup.object({
  correo: Yup.string().email('Correo invalido').required('Requerido'),
});

const ResetPassword = ({navigation}) => {
  const [modal, setModal] = React.useState(false);

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          correo: '',
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values, actions) => {
          console.log(values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View>
            <Box h="100%">
              <Box>
                <HStack alignItems="center">
                  <Box p={2}>
                    <Button
                      onPress={() => navigation.navigate('SignIn')}
                      bg="transparent"
                      _pressed={{bg: 'transparent'}}
                      rounded="4"
                      leftIcon={
                        <MaterialIcon
                          name="keyboard-backspace"
                          color="#272C46"
                          size={30}
                        />
                      }
                    />
                  </Box>

                  <Image
                    source={StudiallyLogo}
                    alt="StudiallyLogo"
                    // my={4}
                    mt={8}
                    mb={4}
                    ml={4}
                    // h="%"
                    size="sm"
                    w="70%"
                  />
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
                {/* <Formik
              initialValues={{
                correo: '',
              }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values, actions) => {
                console.log(values);
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
                <> */}
                <Input
                  placeholder="Correo electrónico"
                  w="75%"
                  mb={6}
                  mt={8}
                  borderColor="#475BD8"
                  rounded="4"
                  onChangeText={handleChange('correo')}
                  value={values.correo}
                  onBlur={handleBlur('correo')}
                  size="xl"
                  InputLeftElement={
                    <MaterialCommunityIcon
                      name="email-outline"
                      style={styles.email_input}
                      size={28}
                      color="#05188B"
                      margin="0 0 0 1rem"
                    />
                  }
                />
                <Button
                  w="75%"
                  mt={6}
                  mb={4}
                  h={12}
                  onPress={() => handleSubmit()}
                  // onPress={handleSubmit}
                  color="#FFF"
                  bg="#475BD8"
                  _pressed={{bg: '#475BD8'}}
                  borderRadius={4}
                  _text={{
                    fontSize: 'lg',
                  }}>
                  Enviar correo
                </Button>
                {/* </>
              )} */}

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
                          _pressed={{bg: '#475BD8'}}
                          onPress={() => setModal(false)}>
                          Entendido
                        </Button>
                      </Modal.Footer>
                    </Center>
                  </Modal.Content>
                </Modal>
              </Flex>
            </Box>
          </View>
        )}
      </Formik>
      {/* </Formik> */}
    </NativeBaseProvider>
  );
};

export default ResetPassword;
