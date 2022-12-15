import * as React from 'react';
import {useEffect, useState} from 'react';

// Native Base
import {
  VStack,
  HStack,
  ScrollView,
  Pressable,
  Box,
  Text,
  Spacer,
} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';

import firestore from '@react-native-firebase/firestore';

const OportunidadesLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [oportunidades, setOportunidades] = useState([]);

  const data = [
    {
      titulo: 'Oportunidad 1',
      organizacion: 'Organización 1',
      texto:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      fecha: '31/12/2021',
    },
    {
      titulo: 'Oportunidad 2',
      texto:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      organizacion: 'Organización 2',
      fecha: '31/12/2021',
    },
    {
      titulo: 'Oportunidad 3',
      texto:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
      organizacion: 'Organización 3',
      fecha: '31/12/2021',
    },
  ];

  const getOpportunities = async () => {
    const snapshot = await firestore().collection('oportunidades').get();
    const oportunities = snapshot.docs.map(doc => doc.data());
    const newOP = [];
    oportunities.sort(function (a, b) {
      return (
        new Date(b.vencimiento.toDate()) - new Date(a.vencimiento.toDate())
      );
    });
    //console.log(oportunities[0].vencimiento.toDate().toDateString());
    setOportunidades(oportunities);
    //return snapshot.docs.map(doc => doc.data());
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
      <ScrollView w="100%" h="75%">
        <VStack space="15px" alignItems="center">
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
                    {item.titulo}
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
