import React from 'react';
import auth from '@react-native-firebase/auth';
import {
  ScrollView,
  VStack,
  Flex,
  Avatar,
  Center,
  Heading,
  Text,
  Pressable,
  Link,
  Box,
  HStack,
  NativeBaseProvider,
} from 'native-base';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FoundationIcon from 'react-native-vector-icons/Foundation';
// React Native
import {useWindowDimensions} from 'react-native';

// Formik
import {Formik} from 'formik';
import {useUser} from '../../../context/User';

const Mas = ({navigation}) => {
  const {height} = useWindowDimensions();

  const {user, userInfo} = useUser();

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <NativeBaseProvider>
      <Formik>
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        }) => (
          <ScrollView h={height} bg="rgba(250, 250, 250, 1)">
            <VStack space={4}>
              <VStack alignItems="flex-start" p={8}>
                <Avatar
                  bg="green.500"
                  size="lg"
                  source={{
                    uri: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
                  }}
                />
                <Heading size="lg" color="#272C46" mt={2}>
                  {userInfo
                    ? userInfo.nombres + ' ' + userInfo.apellidos
                    : null}
                </Heading>
                <Text fontSize={16}>{user.email}</Text>
              </VStack>
              <VStack space={4} alignItems="center">
                <>
                  <Pressable
                    key="1"
                    w="90%"
                    onPress={() => {
                      console.log('Navega a perfil');
                      navigation.navigate('Perfil');
                    }}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex
                        direction="row"
                        align="center"
                        justify="space-between">
                        <MaterialIcon
                          name="person-outline"
                          size={40}
                          color="rgba(6, 22, 120, 1)"
                        />
                        <Text fontSize={18} ml={5}>
                          Perfil
                        </Text>
                      </Flex>
                      <MaterialIcon
                        name="keyboard-arrow-right"
                        size={40}
                        color="rgba(6, 22, 120, 1)"
                        // margin="0 0 0 1rem"
                      />
                    </Flex>
                  </Pressable>
                </>
                <>
                  <Pressable w="90%" key="2">
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex direction="row" align="center">
                        <Box ml={2}>
                          <FoundationIcon
                            name="shield"
                            size={40}
                            color="rgba(6, 22, 120, 1)"
                          />
                        </Box>
                        <Link href="https://www.studially.com/pol%C3%ADtica-de-privacidad">
                          <Text fontSize={18} ml={6}>
                            Aviso de privacidad
                          </Text>
                        </Link>
                      </Flex>
                      <MaterialIcon
                        name="keyboard-arrow-right"
                        size={40}
                        color="rgba(6, 22, 120, 1)"
                        // margin="0 0 0 1rem"
                      />
                    </Flex>
                  </Pressable>
                </>
                <>
                  <Pressable w="90%" key="3">
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex direction="row" align="center">
                        <Box ml={1}>
                          <MaterialIcon
                            name="gavel"
                            size={40}
                            color="rgba(6, 22, 120, 1)"
                          />
                        </Box>
                        <Link href="https://www.studially.com/t%C3%A9rminos-y-condiciones">
                          <Text fontSize={18} ml={4}>
                            Términos y condiciones
                          </Text>
                        </Link>
                      </Flex>
                      <MaterialIcon
                        name="keyboard-arrow-right"
                        size={40}
                        color="rgba(6, 22, 120, 1)"
                        // margin="0 0 0 1rem"
                      />
                    </Flex>
                  </Pressable>
                </>
                <>
                  <Pressable w="90%" key="4">
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex direction="row" align="center">
                        <Box ml={1}>
                          <MaterialIcon
                            name="star-outline"
                            size={40}
                            color="rgba(6, 22, 120, 1)"
                          />
                        </Box>
                        <Link href="https://www.studially.com/">
                        <Text fontSize={18} ml={4}>
                          Califícanos
                        </Text>
                        </Link>
                      </Flex>
                      <MaterialIcon
                        name="keyboard-arrow-right"
                        size={40}
                        color="rgba(6, 22, 120, 1)"
                        // margin="0 0 0 1rem"
                      />
                    </Flex>
                  </Pressable>
                </>
                <>
                  <Pressable key="5" w="90%" onPress={() => signOut()}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex direction="row" align="center">
                        <Box ml={1}>
                          <MaterialIcon
                            name="logout"
                            size={40}
                            color="rgba(6, 22, 120, 1)"
                          />
                        </Box>
                        <Text fontSize={18} ml={4}>
                          Cerrar sesión
                        </Text>
                      </Flex>
                      <MaterialIcon
                        name="keyboard-arrow-right"
                        size={40}
                        color="rgba(6, 22, 120, 1)"
                        // margin="0 0 0 1rem"
                      />
                    </Flex>
                  </Pressable>
                </>
              </VStack>
              <HStack space={4} justifyContent="center" mt={4}>
                <Center
                  bg="rgba(60, 90, 154, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <Link href="https://www.facebook.com/studially/">
                    <FontistoIcon name="facebook" color="white" size={32} />
                  </Link>
                </Center>
                <Center
                  bg="rgba(212, 45, 126, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <Link href="https://www.instagram.com/studially_/">
                    <FontistoIcon name="instagram" color="white" size={32} />
                  </Link>
                </Center>
                <Center
                  bg="rgba(0, 102, 153, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <Link href="https://www.linkedin.com/company/studially">
                    <FontistoIcon name="linkedin" color="white" size={24} />
                  </Link>
                </Center>
                <Center
                  bg="rgba(29, 121, 242, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <MaterialCommunityIcon
                    name="twitter"
                    color="white"
                    size={32}
                  />
                </Center>
              </HStack>
            </VStack>
          </ScrollView>
        )}
      </Formik>
    </NativeBaseProvider>
  );
};

export default Mas;
