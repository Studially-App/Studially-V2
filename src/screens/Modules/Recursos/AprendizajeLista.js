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

const AprendizajeLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] = useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = useState({});

  const [aprendizaje, setAprendizaje] = useState([]);

  const getAprendizaje = async () => {
    const snapshot = await firestore()
      .collection('aprendizaje')
      .orderBy('fecha', 'asc')
      .get();
    const ap = snapshot.docs.map(doc => doc.data());
    setAprendizaje(ap);
  };

  useEffect(() => {
    getAprendizaje();
  });

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <ScrollView w="100%" h="85%">
        <VStack space="15px" alignItems="center">
          {aprendizaje.map((item, i) => (
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
                  <Text fontSize="md">{item.autor}</Text>
                  <Spacer />
                  <HStack justifyContent={'space-between'}>
                    <Text fontSize="md" color="#475BD8">
                      {item.categoria}
                    </Text>
                    <Text fontSize="md" color="#475BD8" textAlign="right">
                      {item.fecha.toDate().toDateString()}
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

export default AprendizajeLista;
