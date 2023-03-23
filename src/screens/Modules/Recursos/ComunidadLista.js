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
import { useUser } from '../../../context/User';
import firestore from '@react-native-firebase/firestore';
import Ficon from 'react-native-vector-icons/Fontisto';

const ComunidadLista = () => {
  // get user data
  const {userInfo, user} = useUser();

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
    setCategories(userInfo.comunidadCategoriaFiltro);
    setUniversities(userInfo.comunidadUniversidadFiltro);
  };

  const getComunidadFilter = async () => {
    let filtro = [];
    comunidad.map(com => {
      categories.map(cat => {
        for(uni of universities){
          if (com.categoria === cat && com.universidad === uni) {
            filtro.push(com);
          }
        }
      });
    });
    setComunidadFiltrado(filtro);
    try {
      await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          comunidadCategoriaFiltro: categories,
        })
        .then(() => {
          console.log('Community category filter updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getUniversidadFilter = async () => {
    let filtro = [];
    comunidad.map(com => {
      universities.map(uni => {
        for(cat of categories){
          if (com.universidad === uni && com.categoria === cat) {
            filtro.push(com);
          }
        }
      });
    });
    setComunidadFiltrado(filtro);
    try {
      await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          comunidadUniversidadFiltro: universities,
        })
        .then(() => {
          console.log('Community university filter updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComunidad();
  }, []);

  useEffect(() => {
    if(comunidad.length > 0 && categories.length > 0 && universities.length > 0){
      getComunidadFilter();
    }
  },[comunidad, categories, universities]);

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
      <ModalFiltroUniversidad
        modalVisibility={universidadModalVisibility}
        setModalVisibility={setUniversidadModalVisibility}
        universities={universities}
        setUniversities={setUniversities}
        getUniversidadFilter={getUniversidadFilter}
      />
    </VStack>
  );
};

export default ComunidadLista;
