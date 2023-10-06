import * as React from 'react';
import { useState, useEffect } from 'react';
// Native Base
import {
  VStack,
  ScrollView,
  Pressable,
  Box,
  Text,
  Spacer,
  HStack,
  Button,
} from 'native-base';

import { useUser } from '../../../context/User';
import firestore from '@react-native-firebase/firestore';
import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';

const ComunidadLista = () => {
  // get user data
  const { userInfo, user } = useUser();
  const [comunidadFiltrado, setComunidadFiltrado] = useState([]);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [detalleModalVisibility, setDetalleModalVisibility] = useState(false);

  useEffect(() => {
    let results = {};
    const queryKeys = {};

    const handleSnapshot = (snapshot, queryKey) => {
      if (queryKeys[queryKey]) {
        queryKeys[queryKey].forEach((id) => delete results[id]);
      }
      queryKeys[queryKey] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        results[doc.id] = data;
        queryKeys[queryKey].push(doc.id);
      });

      const sortedResults = Object.values(results).sort((a, b) => {
        return new Date(b.fecha) - new Date(a.fecha); // Ordena en orden descendente por 'fecha'
      });

      setComunidadFiltrado(Object.values(sortedResults));
    };

    const query1 = firestore()
      .collection('comunidad')
      .where('universidad', '==', userInfo.institucion);

    const query2 = firestore()
      .collection('comunidad')
      .where('universidad', '==', 'Studially');

    const unsubscribe1 = query1.onSnapshot((snapshot) => handleSnapshot(snapshot, 'query1'));
    const unsubscribe2 = query2.onSnapshot((snapshot) => handleSnapshot(snapshot, 'query2'));

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [userInfo.comunidadUniversidadFiltro, userInfo.comunidadCategoriaFiltro]);


  return (
    <VStack space={2} alignItems="center">

      <ScrollView w="100%" h="100%" mt={4}>
        <VStack space="15px" alignItems="center">

          <ModalDetalleBeneficios
            modalVisibility={detalleModalVisibility}
            setModalVisibility={setDetalleModalVisibility}
            data={dataDetalle}
            setData={setDataDetalle}
          />
          {/*<HStack justifyContent="space-around" w="80%">
            <Button
              bg="white"
              borderColor="black"
              borderStyle="solid"
              borderWidth="1"
              onPress={() => setCategoriaModalVisibility(true)}>
              <Text>
                Categoría <Ficon name="equalizer" color="black" size={16} />
              </Text>
            </Button>
            <Button
              bg="white"
              borderColor="black"
              borderStyle="solid"
              borderWidth="1"
              onPress={() => setUniversidadModalVisibility(true)}>
              <Text>
                Universidad <Ficon name="equalizer" color="black" size={16} />
              </Text>
            </Button>
  </HStack>*/}

          <Text textAlign="center" color="#061678" fontSize="30px">
            Comunidad
          </Text>

          {comunidadFiltrado.map((item, i) => (
            <Pressable
              onPress={() => {
                setDataDetalle(item);
                setDetalleModalVisibility(true);
              }}
              w="100%"
              alignItems="center"
              key={i}>
              <Box w="90%" bg="white" shadow={2} rounded={4}>
                <VStack m="15px">
                  <Text fontSize="xl" bold>
                    {item.titulo}
                  </Text>
                  <HStack>
                    <Text fontSize="md">{item.universidad}</Text>
                    <Spacer />
                  </HStack>
                  <Text fontSize="md" color="#475BD8" textAlign="right">
                    {item.etiqueta}
                  </Text>
                </VStack>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default ComunidadLista;
