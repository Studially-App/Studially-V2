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
import ModalFiltroCategoriaComunidad from '../../../components/Recursos/ModalFiltroCategoriaComunidad';
import ModalFiltroUniversidad from '../../../components/Recursos/ModalFiltroUniversidad';
import firestore from '@react-native-firebase/firestore';
import Ficon from 'react-native-vector-icons/Fontisto';

const ComunidadLista = () => {
  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] = useState(false);
  // Data detalle
  const [dataDetalle, setDataDetalle] = useState({});

  // categoría modal detalle
  const [categoriaModalVisibility, setCategoriaModalVisibility] =
    useState(false);

  // categoría modal detalle
  const [universidadModalVisibility, setUniversidadModalVisibility] =
    useState(false);

  const [comunidad, setComunidad] = useState([]);

  const [comunidadFiltrado, setComunidadFiltrado] = useState([]);

  const [categories, setCategories] = useState([
    'Salud y Bienestar',
    'Alimenticio',
    'Educación y Pedagogía',
    'Diseño y Construcción',
    'Digital y Tecnológico',
    'Consultoría',
    'Belleza y Moda',
    'Sustentabilidad',
    'Desarrollo e Investigación',
    'Accesorios',
    'Electrónicos',
    'Entretenimiento',
    'Otros',
  ]);

  const [universities, setUniversities] = useState([
    'Anahuac',
    'EBC',
    'Ibero',
    'IPN',
    'ITAM',
    'ITESM',
    'Justo Sierra',
    'Panamericana',
    'Tec Milenio',
    'ULA',
    'UNAM',
    'ULSA',
    'UVM',
    'Tepeyac',
  ]);

  const getComunidad = async () => {
    const snapshot = await firestore().collection('comunidad').get();
    const com = snapshot.docs.map(doc => doc.data());
    setComunidad(com);
    setComunidadFiltrado(com);
  };

  const getComunidadFilter = () => {
    let filtro = [];
    comunidad.map(com => {
      categories.map(cat => {
        if (com.categoria === cat) {
          filtro.push(com);
        }
      });
    });
    setComunidadFiltrado(filtro);
  };

  const getUniversidadFilter = () => {
    let filtro = [];
    comunidad.map(com => {
      universities.map(uni => {
        if (com.universidad === uni) {
          filtro.push(com);
        }
      });
    });
    setComunidadFiltrado(filtro);
  };

  useEffect(() => {
    getComunidad();
  }, []);

  return (
    <VStack space={2} alignItems="center">
      <ModalDetalleBeneficios
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
      />
      <Text fontSize="lg" bold>
        Comunidad
      </Text>
      <ModalFiltroCategoriaComunidad
        modalVisibility={categoriaModalVisibility}
        setModalVisibility={setCategoriaModalVisibility}
        categories={categories}
        setCategories={setCategories}
        getComunidadFilter={getComunidadFilter}
      />
      <ModalFiltroUniversidad
        modalVisibility={universidadModalVisibility}
        setModalVisibility={setUniversidadModalVisibility}
        universities={universities}
        setUniversities={setUniversities}
        getUniversidadFilter={getUniversidadFilter}
      />
      <ScrollView w="100%" h="75%">
        <VStack space="15px" alignItems="center">
          <HStack justifyContent="space-around" w="80%">
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
          </HStack>

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
                    {item.categoria}
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
