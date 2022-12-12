import * as React from 'react';
import {useState, useEffect} from 'react';
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
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import RedimirRewards from '../../../components/Enfoque/RedimirRewards';

// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const StudiallyRewards = () => {
  // Estado redimir modal
  const [redimirModalVisibility, setRedimirModalVisibility] = useState(false);

  const route = useRoute();

  const [products, setProducts] = useState([]);

  const [idProducto, setIdProducto] = useState(0);

  const getProductsRewards = async () => {
    try {
      const products = await firestore()
        .collection('productosRewards')
        .doc('Productos')
        .get();

      setProducts(products._data.productos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsRewards();
  }, []);

  return (
    <VStack space={2} alignItems="center">
      <RedimirRewards
        modalVisibility={redimirModalVisibility}
        setModalVisibility={setRedimirModalVisibility}
        idProducto={idProducto}
      />
      <ScrollView w="100%" h="88%">
        <VStack space="15px" alignItems="center">
          <HStack
            justifyContent="space-around"
            w="100%"
            alignItems="center"
            mb={2}>
            <Text fontSize={20} fontWeight="bold">
              Tus estrellas
            </Text>
            <Text fontSize={20} fontWeight="bold">
              {route.params.stars}
              <MaterialIcon
                name="star-outline"
                size={20}
                color="rgba(71, 91, 216, 1)"
              />
            </Text>
          </HStack>
          {products.map((item, i) => (
            <Pressable w="100%" alignItems="center" key={i}>
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
                    <Text fontSize="md">
                      {item.puntos}{' '}
                      <MaterialIcon
                        name="star-outline"
                        size={20}
                        color="rgba(71, 91, 216, 1)"
                      />
                    </Text>
                  </VStack>
                </HStack>
                <Button
                  onPress={() => {
                    setIdProducto(item.idProducto);
                    setRedimirModalVisibility(true);
                  }}
                  disabled={route.params.stars <= item.puntos}
                  bg="white"
                  borderWidth={1}
                  borderColor={
                    route.params.stars <= item.puntos ? 'gray.400' : '#475BD8'
                  }
                  alignContent="center"
                  justifyContent="center"
                  alignItems="center"
                  w={'90%'}
                  mb="2">
                  <Text
                    fontSize="18"
                    color={
                      route.params.stars <= item.puntos ? 'gray.400' : '#475BD8'
                    }>
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
