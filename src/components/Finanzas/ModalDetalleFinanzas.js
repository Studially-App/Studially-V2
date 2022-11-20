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
  InputGroup,
  InputLeftAddon,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Formik} from 'formik';

import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

const ModalDetalleFinanzas = ({
  modalVisibility,
  setModalVisibility,
  data,
  setData,
  dataDetalle,
  userId,
  index,
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

  const updateFinantialGoals = values => {
    let edit = [...data];
    edit[index] = values;
    edit[index].montoActual = dataDetalle.montoActual;
    try {
      firestore()
        .collection('usuarios')
        .doc(userId)
        .update({
          finanzas: edit,
        })
        .then(() => {
          console.log('User finantial goals updated!');
        });
      setData(edit);
      setModalVisibility(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NativeBaseProvider>
      <Formik
        enableReinitialize={true}
        initialValues={{
          montoActual: dataDetalle.montoActual,
          montoFinal: dataDetalle.montoFinal,
          nombre: dataDetalle.nombre,
          semanas: dataDetalle.semanas,
        }}
        onSubmit={(values, actions) => {
          console.log(values);
          updateFinantialGoals(values);
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
                      <Text fontSize="15" fontWeight="bold" mb="0" mt="0">
                        ¿Cuál es la meta?
                      </Text>
                      <InputGroup
                        w={{
                          base: '70%',
                          md: '285',
                        }}>
                        <InputLeftAddon
                          children={
                            <MatComIcon
                              name="pencil-outline"
                              size={18}
                              color="#061678"
                            />
                          }
                          h="40px"
                        />
                        <Input
                          key="name"
                          id="nombre"
                          name="nombre"
                          mx="3"
                          placeholder="Nombre de meta"
                          w="100%"
                          h="40px"
                          initialValues={dataDetalle.nombre}
                          value={values.nombre}
                          onChangeText={handleChange('nombre')}
                        />
                      </InputGroup>

                      <Text fontSize="15" fontWeight="bold" mb="0">
                        ¿Cuánto quieres ahorrar?
                      </Text>
                      <InputGroup
                        w={{
                          base: '70%',
                          md: '285',
                        }}>
                        <InputLeftAddon
                          children={
                            <MaterialIcon
                              name="attach-money"
                              size={18}
                              color="#061678"
                            />
                          }
                          h="40px"
                        />
                        <Input
                          key="MF"
                          id="montoFinal"
                          name="montoFinal"
                          mx="3"
                          placeholder="Monto final"
                          w="100%"
                          h="40px"
                          keyboardType="numeric"
                          initialValues={dataDetalle.montoFinal}
                          value={values.montoFinal}
                          onChangeText={handleChange('montoFinal')}
                        />
                      </InputGroup>

                      <Text fontSize="15" fontWeight="bold" mb="0">
                        ¿En cuantas semanas quieres cumplirla?
                      </Text>
                      <HStack alignItems="center">
                        <Box
                          borderStyle="solid"
                          borderColor="#061678"
                          borderRadius="50"
                          borderWidth="1"
                          h="20px"
                          w="20px"
                          alignItems="center">
                          <MatComIcon name="minus" size={18} color="#061678" />
                        </Box>

                        <Input
                          key="Weeks"
                          mx="3"
                          placeholder="semanas"
                          w="100px"
                          initialValues={dataDetalle.semanas}
                          value={values.semanas}
                          id="semanas"
                          name="semanas"
                          keyboardType="numeric"
                          onChangeText={handleChange('semanas')}
                          h="40px"
                        />

                        <Box
                          borderStyle="solid"
                          borderColor="#061678"
                          borderRadius="50"
                          borderWidth="1"
                          h="20px"
                          w="20px"
                          alignItems="center">
                          <MatComIcon name="plus" size={18} color="#061678" />
                        </Box>
                      </HStack>
                      {values.montoFinal && values.semanas ? (
                        <>
                          <Text
                            key="TituloFecha"
                            fontSize="15"
                            mb="0"
                            fontWeight="bold">
                            Para llegar a la meta debes ahorrar
                          </Text>
                          <HStack
                            alignItems="center"
                            justifyContent="space-around">
                            <Box
                              borderRadius={5}
                              w="200px"
                              h="60px"
                              justifyContent="center"
                              alignItems="center"
                              borderColor="black"
                              borderStyle="solid"
                              borderWidth="1">
                              <HStack alignItems="center">
                                <VStack justifyContent="center">
                                  <Text
                                    fontSize="20"
                                    mb="0"
                                    key="montoSemanas"
                                    color="black"
                                    textAlign="center">
                                    {(
                                      values.montoFinal / values.semanas
                                    ).toFixed(2)}{' '}
                                  </Text>
                                  <Text
                                    color="black"
                                    fontSize="15"
                                    textAlign="center">
                                    MXN
                                  </Text>
                                </VStack>
                                <Text color="black" fontSize="15">
                                  {'  '} hasta {'  '}
                                </Text>
                                <Text
                                  fontSize="20"
                                  textAlign="center"
                                  color="black">
                                  {dayjs()
                                    .add(values.semanas, 'week')
                                    .format('DD/MM')
                                    .toString()}
                                </Text>
                              </HStack>
                            </Box>
                            <Text fontSize="15">Por semana</Text>
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

export default ModalDetalleFinanzas;
