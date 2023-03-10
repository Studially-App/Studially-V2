import * as React from 'react';
import {useEffect, useState} from 'react';

// Native Base
import {VStack, ScrollView, Pressable, Box, Text, Spacer} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';

import firestore from '@react-native-firebase/firestore';

const OportunidadesLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [oportunidades, setOportunidades] = useState([]);

  const getOpportunities = async () => {
    const snapshot = await firestore()
      .collection('oportunidades')
      .orderBy('vencimiento', 'asc')
      .get();
    const oportunities = snapshot.docs.map(doc => doc.data());
    setOportunidades(oportunities);
  };

  useEffect(() => {
    getOpportunities();
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
          <Text fontSize="lg" bold>
            Oportunidades
          </Text>
          {oportunidades.map((item, i) => (
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
                  <Text fontSize="md">{item.descripcion}</Text>
                  <Spacer />
                  <Text fontSize="md" color="#475BD8" textAlign="right">
                    {item.vencimiento}
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

export default OportunidadesLista;
