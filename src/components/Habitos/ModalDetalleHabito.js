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
  Heading,
  HStack,
  Pressable,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ModalDetalleHabito = ({
  modalVisibility,
  setModalVisibility,
  data,
  setData,
  updateHabits,
}) => {
  // const [scrollOffset, setScrollOffset] = React.useState(null);
  // const scrollViewReff = React.createRef();

  // Screen Dimentions
  const {width} = useWindowDimensions();

  // const handleOnScroll = event => {
  //   setScrollOffset(event.nativeEvent.contentOffset.y);
  // };
  // const handleScrollTo = p => {
  //   if (scrollViewReff.current) {
  //     scrollViewReff.current.scrollTo(p);
  //   }
  // };

  let frecuenciaBG = [];
  let frecuenciaLetter = [];

  const getFrecuencia = () => {
    for (let i = 0; i <= data.frecuencia.length; i++) {
      if (data.frecuencia[i] === 0) {
        frecuenciaBG.push('white');
        frecuenciaLetter.push('#475BD8');
      } else {
        frecuenciaBG.push('#475BD8');
        frecuenciaLetter.push('white');
      }
    }
  };

  const changeFrecuencia = index => {
    let changeData = {...data};
    if (changeData.frecuencia[index] === 0) {
      changeData.frecuencia[index] = 1;
    } else {
      changeData.frecuencia[index] = 0;
    }
    setData(changeData);
  };

  return (
    <NativeBaseProvider>
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
          // scrollTo={handleScrollTo}
          // scrollOffset={scrollOffset}
          hideModalContentWhileAnimating={true}
          // swipeDirection={['down']}
          // onSwipeComplete={() => {
          //   setModalVisibility(false);
          //   setData({});
          // }}
          style={{
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 50,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          children={
            <VStack space="8" alignItems="center" h="100%" p={8}>
              <Center>
                <Box>
                  <MaterialIcon
                    name="keyboard-arrow-down"
                    size={32}
                    color="rgba(39, 44, 70, 1)"
                    onPress={() => setModalVisibility(false)}
                  />
                </Box>
              </Center>
              <Center mt={0}>
                <Heading>{data.name}</Heading>
              </Center>
              <ScrollView w="95%" maxH={'30%'} mb={0} pb={0}>
                <Text>{data.texto}</Text>
              </ScrollView>
              <Center pt={0}>
                <Heading>Programar frecuencia</Heading>
              </Center>
              <HStack space={3}>
                {data.frecuencia ? getFrecuencia() : null}
                <Pressable onPress={() => changeFrecuencia(0)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[0]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[0]} fontSize="18px" bold>
                      L
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(1)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[1]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[1]} fontSize="18px" bold>
                      M
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(2)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[2]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[2]} fontSize="18px" bold>
                      M
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(3)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[3]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[3]} fontSize="18px" bold>
                      J
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(4)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[4]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[4]} fontSize="18px" bold>
                      V
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(5)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[5]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[5]} fontSize="18px" bold>
                      S
                    </Text>
                  </Box>
                </Pressable>
                <Pressable onPress={() => changeFrecuencia(6)}>
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg={frecuenciaBG[6]}
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color={frecuenciaLetter[6]} fontSize="18px" bold>
                      D
                    </Text>
                  </Box>
                </Pressable>
              </HStack>
              <Button
                bg="rgba(71, 91, 216, 1)"
                _text={{
                  fontSize: 16,
                }}
                w="95%"
                onPress={() => {
                  setModalVisibility(false);
                }}>
                Guardar cambios
              </Button>
            </VStack>
          }
        />
      </View>
    </NativeBaseProvider>
  );
};

export default ModalDetalleHabito;
