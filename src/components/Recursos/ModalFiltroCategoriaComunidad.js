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
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {Formik} from 'formik';

const ModalFiltroCategoriaComunidad = ({
  modalVisibility,
  setModalVisibility,
  categories,
  setCategories,
  getComunidadFilter,
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

  return (
    <NativeBaseProvider>
      <Formik
        initialValues={{
          checked: [],
        }}
        onSubmit={() => {
          getComunidadFilter();
          setModalVisibility(false);
        }}>
        {({handleSubmit}) => (
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
                        accessibilityLabel="choose category"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center">
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Salud y Bienestar</Text>
                          <Checkbox
                            value="Salud y Bienestar"
                            accessibilityLabel="Salud y Bienestar checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Alimenticio</Text>
                          <Checkbox
                            value="Alimenticio"
                            accessibilityLabel="Alimenticio checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Educación y Pedagogía</Text>
                          <Checkbox
                            value="Educación y Pedagogía"
                            accessibilityLabel="Educación y Pedagogía checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Diseño y Construcción</Text>
                          <Checkbox
                            value="Diseño y Construcción"
                            accessibilityLabel="Diseño y Construcción checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Consultoría</Text>
                          <Checkbox
                            value="Consultoría"
                            accessibilityLabel="Consultoría checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Belleza y Moda</Text>
                          <Checkbox
                            value="Belleza y Moda"
                            accessibilityLabel="Belleza y Moda checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Sustentabilidad</Text>
                          <Checkbox
                            value="Sustentabilidad"
                            accessibilityLabel="Sustentabilidad checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Desarrollo e Investigación</Text>
                          <Checkbox
                            value="Desarrollo e Investigación"
                            accessibilityLabel="Desarrollo e Investigación checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Accesorios</Text>
                          <Checkbox
                            value="Accesorios"
                            accessibilityLabel="Accesorios checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Electrónicos</Text>
                          <Checkbox
                            value="Electrónicos"
                            accessibilityLabel="Electrónicos checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Entretenimiento</Text>
                          <Checkbox
                            value="Entretenimiento"
                            accessibilityLabel="Entretenimiento checkbox"
                            name="checked"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Otros</Text>
                          <Checkbox
                            value="Otros"
                            accessibilityLabel="Otros checkbox"
                            name="checked"
                          />
                        </HStack>
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

export default ModalFiltroCategoriaComunidad;
