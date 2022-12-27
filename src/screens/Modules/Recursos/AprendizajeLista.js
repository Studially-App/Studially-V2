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
  Button,
} from 'native-base';

import ModalDetalleBeneficios from '../../../components/Recursos/ModalDetalleBeneficios';
import firestore from '@react-native-firebase/firestore';

import ModalFiltroCategoria from '../../../components/Recursos/ModalFiltroCategoria';

import Ficon from 'react-native-vector-icons/Fontisto';

const AprendizajeLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] = useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = useState({});

  // categoría modal detalle
  const [categoriaModalVisibility, setCategoriaModalVisibility] =
    useState(false);

  const [aprendizaje, setAprendizaje] = useState([]);

  const [aprendizajeFiltrado, setAprendizajeFiltrado] = useState([]);

  const [categories, setCategories] = useState([
    'Ciencia',
    'Productividad',
    'Artes',
    'Economía',
    'Tecnología',
  ]);

  const getAprendizaje = async () => {
    const snapshot = await firestore()
      .collection('aprendizaje')
      .orderBy('fecha', 'asc')
      .get();
    const ap = snapshot.docs.map(doc => doc.data());
    setAprendizaje(ap);
    setAprendizajeFiltrado(ap);
  };

  const getAprendizajeFilter = () => {
    let filtro = [];
    console.log(categories);
    aprendizaje.map(ap => {
      categories.map(cat => {
        if (ap.categoria === cat) {
          filtro.push(ap);
        }
      });
    });
    setAprendizajeFiltrado(filtro);
  };

  useEffect(() => {
    getAprendizaje();
  }, []);

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <ModalFiltroCategoria
        modalVisibility={categoriaModalVisibility}
        setModalVisibility={setCategoriaModalVisibility}
        categories={categories}
        setCategories={setCategories}
        getAprendizajeFilter={getAprendizajeFilter}
      />
      <ScrollView w="100%" h="85%">
        <VStack space="15px" alignItems="center">
          <Button
            bg="white"
            borderColor="black"
            borderStyle="solid"
            borderWidth="1"
            onPress={() => setCategoriaModalVisibility(true)}>
            <Text>
              Filtrar <Ficon name="equalizer" color="black" size={16} />
            </Text>
          </Button>
          {aprendizajeFiltrado.map((item, i) => (
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
