import * as React from 'react';

// Native Base
import {VStack, ScrollView, Pressable} from 'native-base';

import CardBeneficio from '../../../components/Recursos/CardBeneficio';
import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';

const OportunidadesLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

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
          {data.map((item, i) => (
            <Pressable
              onPress={() => {
                setDataDetalle(item);
                setDetalleModalVisibility(true);
              }}
              w="100%"
              alignItems="center"
              key={i}>
              <CardBeneficio
                titulo={item.titulo}
                organizacion={item.organizacion}
                fecha={item.fecha}
              />
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default OportunidadesLista;
