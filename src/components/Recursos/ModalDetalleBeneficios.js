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
  Image,
  Link,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
// React Native
import {useWindowDimensions} from 'react-native';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ModalDetalleBeneficios = ({
  modalVisibility,
  setModalVisibility,
  data,
  setData,
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

  const innerScrollViewRef = React.useRef(null);

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
          scrollTo={handleScrollTo}
          scrollOffset={scrollOffset}
          hideModalContentWhileAnimating={true}
          swipeDirection={['down']}
          onSwipeComplete={() => {
            setModalVisibility(false);
            setData({});
          }}
          style={{
            margin: 0,
          }}
          children={
            <ScrollView
              flex="1"
              ref={scrollViewReff}
              p="8"
              onScroll={handleOnScroll}
              scrollEventThrottle={16}>
              <VStack space="8" alignItems="center" h="100%">
                <Center>
                  <Box>
                    <MaterialIcon
                      name="keyboard-arrow-down"
                      size={32}
                      color="rgba(39, 44, 70, 1)"
                    />
                  </Box>
                </Center>
                <Center>
                  <Heading>{data.titulo}</Heading>
                </Center>
                <Image
                  source={{
                    uri: data.imagenURL,
                  }}
                  alt="Alternate Text"
                  size="xl"
                  w="95%"
                  h="48"
                />
                <ScrollView ref={innerScrollViewRef} w="95%" h="20">
                  <Text w="95%">{data.texto}</Text>
                </ScrollView>

                <Button
                  bg="rgba(71, 91, 216, 1)"
                  _text={{
                    fontSize: 16,
                  }}
                  w="95%">
                  <Link href={data.url} _text={{color: 'white'}}>
                    Más información
                  </Link>
                </Button>
              </VStack>
            </ScrollView>
          }
        />
      </View>
    </NativeBaseProvider>
  );
};

export default ModalDetalleBeneficios;
