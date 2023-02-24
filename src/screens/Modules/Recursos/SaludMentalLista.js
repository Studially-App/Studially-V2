import * as React from 'react';
import {useState, useEffect} from 'react';
// Native Base
import {VStack, ScrollView, Pressable, Box, Text, Spacer} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';
import firestore from '@react-native-firebase/firestore';
import Ficon from 'react-native-vector-icons/Fontisto';

const SaludMentalLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = useState({});

  const [saludMental, setSaludMental] = useState([]);

  const getSaludMental = async () => {
    const snapshot = await firestore()
      .collection('saludMental')
      .orderBy('fecha', 'desc')
      .get();
    const sm = snapshot.docs.map(doc => doc.data());
    setSaludMental(sm);
  };

  useEffect(() => {
    getSaludMental();
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
          {saludMental.map((item, i) => (
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
                    {'  '}
                    {item.autor === 'Studially' ? (
                      <Ficon name="star" color="#475BD8" size={16} />
                    ) : null}
                  </Text>
                  <Text fontSize="md">{item.autor}</Text>
                  <Spacer />
                  <Text fontSize="md" color="#475BD8" textAlign="right">
                    {item.fecha}
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

export default SaludMentalLista;
