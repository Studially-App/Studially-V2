import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { YOUTUBE_KEY } from '@env';
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// React Native
import { useWindowDimensions, Modal, View, StyleSheet, TouchableOpacity } from 'react-native';

// Formik
import { Formik } from 'formik';
import { useUser } from '../../../context/User';
import WebView from 'react-native-webview';

const Mas = ({ navigation }) => {
  const { height } = useWindowDimensions();

  const { user, userInfo } = useUser();

  const profilePictureUrl = userInfo ? userInfo.profilePic : 'https://firebasestorage.googleapis.com/v0/b/studially-2790e.appspot.com/o/logos%2Fprofile.jpeg?alt=media&token=665d38db-7c24-447d-9dae-a04c0b514370';


  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
                    uri: profilePictureUrl,
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
                        <Link href="https://www.studially.com/privacidad">
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
                        <Link href="https://www.studially.com/tyc">
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
                        <Link href="https://www.studially.com/ayuda">
                          <Text fontSize={18} ml={4}>
                          Ayuda
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
                  <Pressable w="90%" key="4" onPress={openModal}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between">
                      <Flex direction="row" align="center">
                        <Box ml={1}>
                          <MaterialIcon
                            name="videocam"
                            size={40}
                            color="rgba(6, 22, 120, 1)"
                          />
                        </Box>
                        <Text fontSize={18} ml={4}>
                          Video de introducción
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
                  <Link href="https://www.instagram.com/studiallyapp/">
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
                  bg="rgba(0, 0, 0, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <Link href="https://www.tiktok.com/@studially">
                    <FontAwesome5
                      name="tiktok"
                      size={32}
                      color="white"
                    />
                  </Link>

                </Center>
                <Center
                  bg="rgba(29,185,84, 1)"
                  borderRadius="full"
                  h={12}
                  w={12}>
                  <Link href="https://open.spotify.com/user/31jhiobbkwifno42em76lwsff7hi?si=036d230e4172420b">
                    <FontAwesome5
                      name="spotify"
                      size={32}
                      color="white"
                    />
                  </Link>

                </Center>
              </HStack>
            </VStack>
          </ScrollView>
        )}
      </Formik>

      <Modal visible={modalVisible} onRequestClose={closeModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <MaterialIcon name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.videoContainer}>
            <WebView source={{ uri: 'https://www.youtube.com/embed/' + YOUTUBE_KEY + '?autoplay=1' }} style={styles.webView} />
          </View>
        </View>
      </Modal>
    </NativeBaseProvider>


  );
};


const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  videoContainer: {
    width: '100%', // Ajusta el ancho según tus necesidades
    height: 400, // Ajusta la altura según tus necesidades
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    alignSelf: 'stretch',
    aspectRatio: 9 / 16, // Ajusta el aspect ratio según tus necesidades
  },
});

export default Mas;
