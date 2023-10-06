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
  Checkbox,
  HStack,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import { useWindowDimensions } from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Formik } from 'formik';

const ModalFiltroCategoria = ({
  modalVisibility,
  setModalVisibility,
  categories,
  setCategories,
  getAprendizajeFilter,
}) => {
  const [scrollOffset, setScrollOffset] = React.useState(null);
  const scrollViewReff = React.createRef();

  // Screen Dimentions
  const { width } = useWindowDimensions();

  const handleOnScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = p => {
    if (scrollViewReff.current) {
      scrollViewReff.current.scrollTo(p);
    }
  };

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          checked: [],
        }}
        onSubmit={() => {
          getAprendizajeFilter();
          setModalVisibility(false);
        }}>
        {({ handleSubmit }) => (
          <View w={width}>
            <Modal
              isVisible={modalVisibility}
              onBackButtonPress={() => {
                setModalVisibility(false);
              }}
              backgroundColor="white"
              backdropOpacity={0.72}
              onBackdropPress={() => {
                setModalVisibility(false);
              }}
              scrollTo={handleScrollTo}
              scrollOffset={scrollOffset}
              hideModalContentWhileAnimating={true}
              swipeDirection={['down']}
              onSwipeComplete={() => {
                setModalVisibility(false);
              }}
              style={{
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 150,
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
                  <VStack space="5" h="100%">
                    <Center>
                      <Box mb="0">
                        <MaterialIcon
                          name="keyboard-arrow-down"
                          size={32}
                          color="rgba(39, 44, 70, 1)"
                        />
                      </Box>
                    </Center>
                    <VStack space="4" h="100%" alignItems="center">
                      <Text
                        fontSize="20"
                        fontWeight="bold"
                        mb="0"
                        textAlign="center">
                        Filtrar por
                      </Text>

                      <Checkbox.Group
                        onChange={setCategories}
                        value={categories}
                        accessibilityLabel="choose category">
                        <VStack space="2" ml={10}>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Educación financiera</Text>
                            <Checkbox
                              value="Educación financiera"
                              accessibilityLabel="Educación financiera checkbox"
                              name="checked"
                            />
                          </HStack>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Introducción laboral</Text>
                            <Checkbox
                              value="Introducción laboral"
                              accessibilityLabel="Introducción laboral checkbox"
                              name="checked"
                            />
                          </HStack>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Soft-Skills</Text>
                            <Checkbox
                              value="Soft-Skills"
                              accessibilityLabel="Soft-Skills checkbox"
                              name="checked"
                            />
                          </HStack>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Bienestar</Text>
                            <Checkbox
                              value="Bienestar"
                              accessibilityLabel="Bienestar checkbox"
                              name="checked"
                            />
                          </HStack>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Adulting</Text>
                            <Checkbox
                              value="Adulting"
                              accessibilityLabel="Adulting checkbox"
                              name="checked"
                            />
                          </HStack>
                          <HStack
                            justifyContent="space-between"
                            alignItems="center"
                            w="85%">
                            <Text fontSize="18">Extra</Text>
                            <Checkbox
                              value="Extra"
                              accessibilityLabel="Extra checkbox"
                              name="checked"
                            />
                          </HStack>
                        </VStack>
                      </Checkbox.Group>



                      <Button
                        bg="#475BD8"
                        _text={{
                          fontSize: 20,
                          textAlign: 'center',
                        }}
                        onPress={() => {
                          handleSubmit();
                        }}
                        type="submit"
                        w="80%"
                        mb="0">
                        Guardar cambios
                      </Button>

                      <Button
                        onPress={() => {
                          setModalVisibility(false);
                          //setData({});
                        }}
                        bg="white"
                        _text={{
                          fontSize: 20,
                          color: '#475BD8',
                          textAlign: 'center',
                        }}
                        borderColor="#475BD8"
                        borderStyle="solid"
                        borderWidth="1px"
                        w="80%"
                        mt="0">
                        Cancelar
                      </Button>
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

export default ModalFiltroCategoria;
