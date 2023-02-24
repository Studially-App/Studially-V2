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

const ModalFiltroUniversidad = ({
  modalVisibility,
  setModalVisibility,
  universities,
  setUniversities,
  getUniversidadFilter,
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
          getUniversidadFilter();
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
                marginTop: 20,
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
                        onChange={setUniversities}
                        value={universities}
                        accessibilityLabel="choose category"
                        justifyContent="center"
                        alignContent="center"
                        alignItems="center">
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Anahuac</Text>
                          <Checkbox
                            value="Anahuac"
                            accessibilityLabel="Anahuac checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">EBC</Text>
                          <Checkbox
                            value="EBC"
                            accessibilityLabel="EBC checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Ibero</Text>
                          <Checkbox
                            value="Ibero"
                            accessibilityLabel="Ibero checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">IPN</Text>
                          <Checkbox
                            value="IPN"
                            accessibilityLabel="IPN checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">ITAM</Text>
                          <Checkbox
                            value="ITAM"
                            accessibilityLabel="ITAM checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">ITESM</Text>
                          <Checkbox
                            value="ITESM"
                            accessibilityLabel="ITESM checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Justo Sierra</Text>
                          <Checkbox
                            value="Justo Sierra"
                            accessibilityLabel="Justo Sierra checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Panamericana</Text>
                          <Checkbox
                            value="Panamericana"
                            accessibilityLabel="Panamericana checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Tec Milenio</Text>
                          <Checkbox
                            value="Tec Milenio"
                            accessibilityLabel="Tec Milenio checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">ULA</Text>
                          <Checkbox
                            value="ULA"
                            accessibilityLabel="ULA checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">UNAM</Text>
                          <Checkbox
                            value="UNAM"
                            accessibilityLabel="UNAM checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Universidad la Salle</Text>
                          <Checkbox
                            value="ULSA"
                            accessibilityLabel="Universidad la Salle checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">UVM</Text>
                          <Checkbox
                            value="UVM"
                            accessibilityLabel="UVM checkbox"
                          />
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                          w="80%">
                          <Text fontSize="18">Tepeyac</Text>
                          <Checkbox
                            value="Tepeyac"
                            accessibilityLabel="Tepeyac checkbox"
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

export default ModalFiltroUniversidad;
