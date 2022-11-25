/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  ScrollView,
  VStack,
  Center,
  Box,
  Text,
  View,
  Button,
  NativeBaseProvider,
  Input,
  InputGroup,
  InputLeftAddon,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Formik} from 'formik';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ModalAgregarAmigo = ({
  modalVisibility,
  setModalVisibility,
  amigos,
  setAmigos,
}) => {
  const [scrollOffset, setScrollOffset] = React.useState(null);
  const scrollViewReff = React.createRef();

  // Screen Dimentions
  const {width} = useWindowDimensions();

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = p => {
    if (scrollViewReff.current) {
      scrollViewReff.current.scrollTo(p);
    }
  };

  const findFriend = async values => {
    console.log('FindFriend', values);
    const userInfoFB = await firestore()
      .collection('usuarios')
      .where('email', '==', values.correoAmigo)
      .get();
    console.log({
      nombres: userInfoFB._docs[0]._data.nombres,
      apellidos: userInfoFB._docs[0]._data.apellidos,
      fuegos: userInfoFB._docs[0]._data.fuegos,
    });
    return {
      nombres: userInfoFB._docs[0]._data.nombres,
      apellidos: userInfoFB._docs[0]._data.apellidos,
      fuegos: userInfoFB._docs[0]._data.fuegos,
    };
  };

  const updateAmigos = async values => {
    const newFriend = await findFriend(values);
    const friends = [...amigos];
    friends.push(newFriend);
    console.log(friends);
    setAmigos(friends);
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          correoAmigo: '',
        }}
        onSubmit={(values, actions) => {
          updateAmigos(values);
          actions.resetForm();
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
          <View w={width}>
            <Modal
              isVisible={modalVisibility}
              onBackButtonPress={() => {
                setModalVisibility(false);
                //setData({});
              }}
              backgroundColor="white"
              backdropOpacity={0.72}
              onBackdropPress={() => {
                setModalVisibility(false);
                //setData({});
              }}
              scrollTo={handleScrollTo}
              scrollOffset={scrollOffset}
              hideModalContentWhileAnimating={true}
              swipeDirection={['down']}
              onSwipeComplete={() => {
                setModalVisibility(false);
                //setData({});
              }}
              style={{
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 300,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
              children={
                <ScrollView
                  flex="1"
                  ref={scrollViewReff}
                  p="8"
                  onScroll={handleOnScroll}
                  scrollEventThrottle={16}>
                  <VStack space="8" h="100%">
                    <Center>
                      <Box mb="0">
                        <MaterialIcon
                          name="keyboard-arrow-down"
                          size={32}
                          color="rgba(39, 44, 70, 1)"
                        />
                      </Box>
                    </Center>
                    <VStack space="4" h="100%">
                      <Text fontSize="15" fontWeight="bold" mb="0">
                        Correo electrónico
                      </Text>
                      <InputGroup
                        w={{
                          base: '70%',
                          md: '285',
                        }}>
                        <InputLeftAddon
                          children={
                            <MaterialIcon
                              name="person-search"
                              size={18}
                              color="#061678"
                            />
                          }
                          h="40px"
                        />
                        <Input
                          key="MF"
                          id="correoAmigo"
                          name="correoAmigo"
                          mx="3"
                          placeholder="correo@ejemplo.com"
                          w="100%"
                          h="40px"
                          value={values.correoAmigo}
                          onChangeText={handleChange('correoAmigo')}
                        />
                      </InputGroup>

                      <Center>
                        <Button
                          bg="#475BD8"
                          _text={{
                            fontSize: 20,
                          }}
                          onPress={() => {
                            handleSubmit();
                          }}
                          w="96%"
                          mb="0">
                          Agregar
                        </Button>
                      </Center>
                      <Center>
                        <Button
                          onPress={() => {
                            setModalVisibility(false);
                            //setData({});
                          }}
                          bg="white"
                          _text={{
                            fontSize: 20,
                            color: '#475BD8',
                          }}
                          borderColor="#475BD8"
                          borderStyle="solid"
                          borderWidth="1px"
                          w="96%"
                          mt="0">
                          Cancelar
                        </Button>
                      </Center>
                    </VStack>
                  </VStack>
                </ScrollView>
              }
            />
          </View>
        )}
      </Formik>
    </NativeBaseProvider>
  );
};

export default ModalAgregarAmigo;
