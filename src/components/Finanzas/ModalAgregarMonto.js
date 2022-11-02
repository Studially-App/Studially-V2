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
  selected,
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

  const updateAmount = values => {
    data[selected].montoActual =
      data[selected].montoActual * 1 + values.montoActual * 1;
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
        }}
        onSubmit={values => {
          console.log(values);
          updateAmount(values);
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
                      <Text fontSize="20" fontWeight="bold" mb="0">
                        Ingresar monto
                      </Text>
                      <Input
                        key="MF"
                        mx="3"
                        placeholder="Monto"
                        w="100%"
                        maxWidth="300px"
                        value={values.montoFinal}
                        id="montoFinal"
                        name="montoFinal"
                        keyboardType="numeric"
                        onChangeText={handleChange('montoActual')}
                      />
                      <Text fontSize="12" fontWeight="bold" mb="0">
                        Puedes ingresar números negativos para representar
                        egresos
                      </Text>

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

export default ModalAgregarMonto;
