import * as React from 'react';
import {useState, useEffect} from 'react';
// Native Base
import {VStack, ScrollView, Pressable, Box, Text, Spacer} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';
import firestore from '@react-native-firebase/firestore';

const SaludMentalLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [saludMental, setSaludMental] = useState([]);

  const getSaludMental = async () => {
    const snapshot = await firestore()
      .collection('saludMental')
      .orderBy('fecha', 'desc')
      .get();
    const sm = snapshot.docs.map(doc => doc.data());
    // oportunities.sort(function (a, b) {
    //   return (
    //     new Date(b.vencimiento.toDate()) - new Date(a.vencimiento.toDate())
    //   );
    // });
    //console.log(oportunities[0].vencimiento.toDate().toDateString());
    setSaludMental(sm);
    //return snapshot.docs.map(doc => doc.data());
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
      <ScrollView w="100%" h="75%">
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
                  </Text>
                  <Text fontSize="md">{item.autor}</Text>
                  <Spacer />
                  <Text fontSize="md" color="#475BD8" textAlign="right">
                    {item.fecha.toDate().toDateString()}
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
