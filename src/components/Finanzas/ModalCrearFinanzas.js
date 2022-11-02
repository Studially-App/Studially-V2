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
  HStack,
  Input,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Formik} from 'formik';

import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

const ModalCrearFinanzas = ({
  modalVisibility,
  setModalVisibility,
  data,
  setData,
  userId,
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

  const updateFinantilGoals = values => {
    data.push(values);
    try {
      firestore()
        .collection('usuarios')
        .doc(userId)
        .update({
          finanzas: data,
        })
        .then(() => {
          console.log('User finantial goals updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          montoActual: 0,
          montoFinal: 0,
          nombre: '',
          semanas: '',
        }}
        onSubmit={values => {
          console.log(values);
          updateFinantilGoals(values);
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
                setData({});
              }}
              backgroundColor="white"
              backdropOpacity={0.72}
              onBackdropPress={() => {
                setModalVisibility(false);
                setData({});
              }}
              scrollTo={handleScrollTo}
              scrollOffset={scrollOffset}
              hideModalContentWhileAnimating={true}
              swipeDirection={['down']}
              onSwipeComplete={() => {
                setModalVisibility(false);
                setData({});
              }}
              style={{
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 10,
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
                      <Text fontSize="20" fontWeight="bold" mb="0" mt="0">
                        ¿Cuál es la meta?
                      </Text>
                      <Input
                        key="name"
                        id="nombre"
                        name="nombre"
                        mx="3"
                        placeholder="Nombre de meta"
                        w="100%"
                        maxWidth="300px"
                        value={values.nombre}
                        onChangeText={handleChange('nombre')}
                      />

                      <Text fontSize="20" fontWeight="bold" mb="0">
                        ¿Cuánto quieres ahorrar?
                      </Text>
                      <Input
                        key="MF"
                        mx="3"
                        placeholder="Monto final"
                        w="100%"
                        maxWidth="300px"
                        value={values.montoFinal}
                        id="montoFinal"
                        name="montoFinal"
                        keyboardType="numeric"
                        onChangeText={handleChange('montoFinal')}
                      />

                      <Text fontSize="20" fontWeight="bold" mb="0">
                        ¿En cuanto tiempo quieres cumplirla?
                      </Text>
                      <HStack>
                        <Input
                          key="Weeks"
                          mx="3"
                          placeholder="semanas"
                          w="75%"
                          maxWidth="300px"
                          value={values.semanas}
                          id="semanas"
                          name="semanas"
                          keyboardType="numeric"
                          onChangeText={handleChange('semanas')}
                        />
                        <Text fontSize="15" mb="0">
                          semanas
                        </Text>
                      </HStack>
                      {values.montoFinal && values.semanas ? (
                        <>
                          <Text key="TituloFecha" fontSize="15" mb="0">
                            Para llegar a la meta debes ahorrar
                          </Text>
                          <HStack
                            alignItems="center"
                            justifyContent="space-around">
                            <Box
                              borderRadius={5}
                              maxW="200px"
                              h="60px"
                              borderColor="#05188B"
                              borderStyle="solid"
                              borderWidth="1">
                              <HStack alignItems="center">
                                <VStack justifyContent="center">
                                  <Text
                                    fontSize="20"
                                    mb="0"
                                    key="montoSemanas"
                                    color="#05188B"
                                    textAlign="center">
                                    {(
                                      values.montoFinal / values.semanas
                                    ).toFixed(2)}{' '}
                                  </Text>
                                  <Text
                                    color="#05188B"
                                    fontSize="15"
                                    textAlign="center">
                                    MXN
                                  </Text>
                                </VStack>
                                <Text color="#05188B" fontSize="15">
                                  {'  '} hasta {'  '}
                                </Text>
                                <Text
                                  fontSize="20"
                                  textAlign="center"
                                  color="#05188B">
                                  {dayjs()
                                    .add(values.semanas, 'week')
                                    .format('DD/MM')
                                    .toString()}
                                </Text>
                              </HStack>
                            </Box>
                            <Text fontSize="20">Por semana</Text>
                          </HStack>
                        </>
                      ) : null}
                      <Center>
                        <Button
                          bg="#475BD8"
                          _text={{
                            fontSize: 20,
                          }}
                          onPress={handleSubmit}
                          w="96%"
                          mb="0">
                          Guardar cambios
                        </Button>
                      </Center>
                      <Center>
                        <Button
                          onPress={() => {
                            setModalVisibility(false);
                            setData({});
                          }}
                          bg="#D26908"
                          _text={{
                            fontSize: 20,
                          }}
                          w="96%"
                          mt="-5">
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

export default ModalCrearFinanzas;
