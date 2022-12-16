import * as React from 'react';
import {useState, useEffect} from 'react';
// Native Base
import {
  VStack,
  ScrollView,
  Pressable,
  Box,
  Text,
  Spacer,
  HStack,
} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';
import firestore from '@react-native-firebase/firestore';

const ComunidadLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] = useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = useState({});

  const [comunidad, setComunidad] = useState([]);

  const getComunidad = async () => {
    const snapshot = await firestore().collection('comunidad').get();
    const com = snapshot.docs.map(doc => doc.data());
    setComunidad(com);
  };

  useEffect(() => {
    getComunidad();
  });

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <ScrollView w="100%" h="75%">
        <VStack space="15px" alignItems="center">
          {comunidad.map((item, i) => (
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
                    <Text fontSize="md" color="#475BD8" textAlign="right">
                      {item.categoria}
                    </Text>
                  </HStack>
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
