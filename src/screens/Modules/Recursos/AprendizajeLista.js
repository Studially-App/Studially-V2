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
import {useUser} from '../../../context/User';

import ModalFiltroCategoria from '../../../components/Recursos/ModalFiltroCategoria';

import Ficon from 'react-native-vector-icons/Fontisto';

const AprendizajeLista = () => {
  // get user data
  const {userInfo, user} = useUser();

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
    'Ciencia y Tecnología',
    'Salud y Bienestar',
    'Arte y Cultura',
    'Negocios y Economía',
    'Tendencia y Recomendaciones',
    'Soft-Skills',
  ]);

  const getAprendizaje = async () => {
    const snapshot = await firestore()
      .collection('aprendizaje')
      .orderBy('fecha', 'desc')
      .get();
    const ap = snapshot.docs.map(doc => doc.data());
    setAprendizaje(ap);
    setCategories(userInfo.aprendizajeCategoriaFiltro);
  };

  const getAprendizajeFilter = async () => {
    let filtro = [];
    aprendizaje.map(ap => {
      categories.map(cat => {
        if (ap.categoria === cat) {
          filtro.push(ap);
        }
      });
    });
    setAprendizajeFiltrado(filtro);
    try {
      await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          aprendizajeCategoriaFiltro: categories,
        })
        .then(() => {
          console.log('Aprendizaje categories filter updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAprendizaje();
  }, []);

  useEffect(() => {
    if (aprendizaje.length > 0 && categories.length > 0) {
      getAprendizajeFilter();
    }
  }, [aprendizaje, categories]);

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <Text fontSize="lg" bold>
        Aprendizaje
      </Text>
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
                    {'  '}
                    {item.autor === 'Studially' ? (
                      <Ficon name="star" color="#475BD8" size={16} />
                    ) : null}
                  </Text>
                  <Text fontSize="md">{item.autor}</Text>
                  <Spacer />
                  <HStack justifyContent={'space-between'}>
                    <Text fontSize="md" color="#475BD8">
                      {item.categoria}
                    </Text>
                    <Text fontSize="md" color="#475BD8" textAlign="right">
                      {item.fecha}
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
