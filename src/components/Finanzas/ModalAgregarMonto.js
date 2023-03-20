/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
  Spinner,
  Heading,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Formik} from 'formik';

import firestore from '@react-native-firebase/firestore';

const ModalAgregarMonto = ({
  modalVisibility,
  setModalVisibility,
  setCongratsModalVisibility,
  selected,
  data,
  setData,
  setFinantialGoals,
  userId,
  done
}) => {
  const [scrollOffset, setScrollOffset] = React.useState(null);
  const scrollViewReff = React.createRef();

  // Screen Dimentions
  const {width} = useWindowDimensions();

  //Spiner
  const [spinnerModal, setSpinnerModal] = useState(false);

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = p => {
    if (scrollViewReff.current) {
      scrollViewReff.current.scrollTo(p);
    }
  };

  const deleteFinance = id => {
    const deleted = [...data];
    deleted.splice(id, 1);
    try {
      firestore()
        .collection('usuarios')
        .doc(userId)
        .update({
          finanzas: deleted,
          metasCumplidas: done+1
        })
        .then(() => {
          console.log('User finantial goals updated!');
          setFinantialGoals(deleted);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateAmount = async values => {
    data[selected].montoActual =
      data[selected].montoActual * 1 + values.montoActual * 1;
    setSpinnerModal(true);
    try {
      await firestore()
        .collection('usuarios')
        .doc(userId)
        .update({
          finanzas: data,
        })
        .then(() => {
          console.log('User finantial goals updated!');
        });
      setModalVisibility(false);
      setSpinnerModal(false);
      if (data[selected].montoActual >= data[selected].montoFinal) {
        setCongratsModalVisibility(true);
        deleteFinance(selected);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          montoActual: 0,
        }}
        onSubmit={async (values, actions) => {
          console.log(values);
          setSpinnerModal(true);
          await updateAmount(values);
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
                        Ingresar monto
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
                          id="montoActual"
                          name="montoActual"
                          mx="3"
                          placeholder="Monto"
                          w="100%"
                          h="40px"
                          keyboardType="numeric"
                          value={values.montoActual}
                          onChangeText={handleChange('montoActual')}
                        />
                      </InputGroup>
                      <Text fontSize="12" fontWeight="bold" mb="0">
                        Puedes ingresar números negativos para representar
                        egresos
                      </Text>
                      {spinnerModal ? (
                        <Center>
                          <Spinner color="cyan.500" size="lg" />
                          <Heading color="cyan.500" fontSize="md">
                            Agregando monto
                          </Heading>
                        </Center>
                      ) : null}
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

export default ModalAgregarMonto;
