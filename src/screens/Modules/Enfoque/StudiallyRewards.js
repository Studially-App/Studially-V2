import * as React from 'react';
// Native Base
import {
  VStack,
  ScrollView,
  Pressable,
  Box,
  Text,
  HStack,
  Image,
  Button,
} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';

const StudiallyRewards = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const data = [
    {
      nombre: 'Teclado',
      imagenURL: 'https://i.imgur.com/An4m8A4.jpeg',
      puntos: '999,999',
    },
    {
      nombre: 'Teclado',
      imagenURL: 'https://i.imgur.com/An4m8A4.jpeg',
      puntos: '999,999',
    },
    {
      nombre: 'Teclado',
      imagenURL: 'https://i.imgur.com/An4m8A4.jpeg',
      puntos: '999,999',
    },
  ];

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <ScrollView w="100%" h="95%">
        <VStack space="15px" alignItems="center">
          {data.map((item, i) => (
            <Pressable
              onPress={() => {
                setDataDetalle(item);
                setDetalleModalVisibility(true);
              }}
              w="100%"
              alignItems="center"
              key={i}>
              <Box
                w="90%"
                bg="white"
                shadow={2}
                rounded={4}
                alignItems="center">
                <HStack w={'100%'}>
                  <Image
                    source={{
                      uri: item.imagenURL,
                    }}
                    alt="imagen del producto"
                    size="sm"
                    w={'30%'}
                    ml="5%"
                    mt={'2'}
                  />
                  <VStack m="15px" w={'70%'}>
                    <Text fontSize="xl" bold>
                      {item.nombre}
                    </Text>
                    <Text fontSize="md">{item.puntos}</Text>
                  </VStack>
                </HStack>
                <Button
                  onPress={() => {
                    console.log('Redimir');
                  }}
                  bg="white"
                  borderWidth={1}
                  borderColor="#475BD8"
                  alignContent="center"
                  justifyContent="center"
                  alignItems="center"
                  w={'90%'}
                  mb="2">
                  <Text fontSize="18" color="#475BD8">
                    Redimir producto
                  </Text>
                </Button>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default StudiallyRewards;
