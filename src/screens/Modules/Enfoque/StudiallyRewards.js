import * as React from 'react';
import { useState, useEffect } from 'react';
// Native Base
import {
  VStack,
  ScrollView,
  Pressable,
  Box,
  Text,
  HStack,
  Image,
  Button,
  Badge,
} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';
import RedimirRewards from '../../../components/Enfoque/RedimirRewards';
import StudiallyProModal from '../../../components/StudiallyProModal';
import { useUser } from '../../../context/User';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Card from './Card';
import CardSkeleton from './CardSkeleton';

const StudiallyRewards = () => {

  const [isLoading, setIsLoading] = useState(true);

  // Estado redimir modal
  const [redimirModalVisibility, setRedimirModalVisibility] = useState(false);

  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);

  const route = useRoute();

  const [products, setProducts] = useState([]);

  const [idProducto, setIdProducto] = useState(0);

  const { user, userInfo, userTier } = useUser();

  useEffect(() => {
    let results = {};  // Inicializa results aquí para empezar de cero cada vez
    const queryKeys = {};
    setIsLoading(true);
    const handleSnapshot = (snapshot, queryKey) => {
       
      // Limpia los documentos que pertenecen a esta query
      if (queryKeys[queryKey]) {
        queryKeys[queryKey].forEach(id => delete results[id]);
      }
      queryKeys[queryKey] = [];
  
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        results[doc.id] = data;
        queryKeys[queryKey].push(doc.id);
      });
  
      setProducts(Object.values(results));
      setIsLoading(false);
    };
  
    const query1 = firestore()
      .collection('productosRewards')
      .where('universidad', '==', userInfo.institucion);
  
    const query2 = firestore()
      .collection('productosRewards')
      .where('universidad', '==', 'Studially');
  
    const unsubscribe1 = query1.onSnapshot(snapshot => handleSnapshot(snapshot, 'query1'));
    const unsubscribe2 = query2.onSnapshot(snapshot => handleSnapshot(snapshot, 'query2'));
  
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [userInfo.institucion]);  // Escucha los cambios en userInfo.institucion
  
  
  

  return (
    <VStack space={2} alignItems="center" style={{ padding: 0, paddingLeft: 15, paddingRight: 15, marginBottom: 120 }}>
      <RedimirRewards
        modalVisibility={redimirModalVisibility}
        setModalVisibility={setRedimirModalVisibility}
        idProducto={idProducto}
      />
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
      <ScrollView w="100%" h="100%">
        <VStack space="15px" alignItems="center">
          <Text fontSize={24} fontWeight="bold">
            Rewards
          </Text>
          <Text fontSize={18} mb="20px">
            Aquí encontrarás grandes premios que podrás obtener por tu desempeño.
          </Text>
          {isLoading ? (
            // Muestra esqueletos si los datos están cargando
            Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            // Muestra tarjetas si los datos ya están cargados
            products.map((item, i) => (
              <Card
                key={i}
                title={item.titulo}
                subtitle={item.descripcion}
                imageUrl={item.imagenURL}
                onPress={() => console.log('Tarjeta presionada!')}
                link={item.linkNoticia}
                idProducto={item.idProducto}
              />
            ))
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
};

export default StudiallyRewards;
