import React, {useState, useEffect} from 'react';

// Auth
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  Text,
  NativeBaseProvider,
  VStack,
  Box,
  Button,
  Progress,
  HStack,
  Fab,
  ScrollView,
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import ModalCrearFinanzas from '../../../components/Finanzas/ModalCrearFinanzas';
import ModalAgregarMonto from '../../../components/Finanzas/ModalAgregarMonto';

const Finanzas = () => {
  // get user data
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  // Estado modal crear
  const [crearModalVisibility, setCrearModalVisibility] = React.useState(false);

  // Estado modal monto
  const [montoModalVisibility, setMontoModalVisibility] = React.useState(false);

  // Estado de cual se modifica
  const [metaSelected, setMetaSelected] = React.useState(0);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const getUserInfo = async (user, mounted) => {
    if (mounted) {
      const userInfoFB = await firestore()
        .collection('usuarios')
        .where('email', '==', user.email)
        .get();
      setUserInfo(userInfoFB._docs[0]._data);
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  useEffect(() => {
    let isMounted = true;
    if (user != undefined) {
      getUserInfo(user, isMounted);
      return () => {
        isMounted = false;
      };
    }
  }, [user]);

  // Finanzas states
  const [finantialGoals, setFinantialGoals] = useState([]);

  //Funcion para sacar los hábitos
  const getFinance = (userInfo, mounted) => {
    if (mounted) {
      if (userInfo) {
        let userFinantialGoals = userInfo.finanzas;
        setFinantialGoals(userFinantialGoals);
      }
    }
  };

  const deleteFinance = id => {
    const deleted = [...finantialGoals];
    deleted.splice(id, 1);
    setFinantialGoals(deleted);
    try {
      firestore()
        .collection('usuarios')
        .doc(userInfo.userId)
        .update({
          finanzas: deleted,
        })
        .then(() => {
          console.log('User finantial goals updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect para iniciar con las metas agregadas
  useEffect(() => {
    let isMounted = true;
    if (userInfo != undefined) {
      getFinance(userInfo, isMounted);
      return () => {
        isMounted = false;
      };
    }
  }, [userInfo]);

  if (initializing) return null;

  return (
    <NativeBaseProvider>
      {Object.keys(finantialGoals).length === 0 ? (
        <VStack space={4} alignItems="center">
          <Box
            width="90%"
            height="85%"
            bg="transparent"
            p="4"
            borderWidth={2}
            borderRadius={9}
            borderColor="#061678"
            borderStyle="dashed"
            alignItems="center"
            justifyContent="center"
            marginTop={10}>
            <Text textAlign="center" color="#061678" fontSize="22px">
              Aún no haz creado metas financieras
            </Text>
            <Button
              onPress={() => {
                setCrearModalVisibility(true);
              }}
              bg="#475BD8">
              <Text fontSize="xl" color="white">
                Crear meta
              </Text>
            </Button>
            <Text textAlign="center" color="#061678" fontSize="18px">
              Recuerda que puedes crear hasta 3 metas
            </Text>
          </Box>
        </VStack>
      ) : (
        <>
          <Fab
            position="absolute"
            size="sm"
            icon={<AntIcon color="white" name="plus" size={20} />}
            right={30}
            bottom={90}
            bg="#061678"
            onPress={() => setCrearModalVisibility(true)}
          />
          <ScrollView h="78%">
            <VStack space={4} alignItems="center">
              <Text textAlign="center" color="#061678" fontSize="30px">
                Finanzas
              </Text>

              {finantialGoals.map((item, i) => (
                <Box
                  width="90%"
                  height="200px"
                  bg="white"
                  p="4"
                  shadow={2}
                  borderRadius={5}
                  alignItems="center"
                  justifyContent="center"
                  key={i}>
                  <HStack justifyContent="space-around">
                    <Text textAlign="center" color="#061678" fontSize="22px">
                      {item.nombre}
                    </Text>
                    <Icon
                      size={25}
                      color="red"
                      name="trash-can-outline"
                      onPress={() => deleteFinance(i)}
                    />
                  </HStack>

                  <HStack alignItems="center">
                    <Text textAlign="center" color="#061678" fontSize="15px">
                      $ {item.montoActual}
                    </Text>
                    <Box w="70%" maxW="400">
                      <Progress
                        value={(item.montoActual * 100) / item.montoFinal}
                        mx="4"
                      />
                    </Box>
                    <VStack>
                      <Icon
                        size={30}
                        color="#061678"
                        name="flag-variant-outline"
                      />
                      <Text textAlign="center" color="#061678" fontSize="15px">
                        $ {item.montoFinal}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    onPress={() => {
                      setMetaSelected(i);
                      setMontoModalVisibility(true);
                    }}
                    bg="white"
                    borderWidth={1}
                    borderColor="#475BD8"
                    alignContent={'center'}
                    justifyContent={'center'}
                    w={'100%'}>
                    <Text fontSize="xl" color="#475BD8">
                      <MaterialIcon
                        size={20}
                        color="#475BD8"
                        name="attach-money"
                      />
                      Ingresar monto
                    </Text>
                  </Button>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        </>
      )}
      <ModalCrearFinanzas
        modalVisibility={crearModalVisibility}
        setModalVisibility={setCrearModalVisibility}
        setData={setDataDetalle}
        userId={userInfo?.userId}
        data={finantialGoals}
        userInfo={userInfo}
        //reloadGoals={reloadGoals}
      />
      <ModalAgregarMonto
        modalVisibility={montoModalVisibility}
        setModalVisibility={setMontoModalVisibility}
        setData={setDataDetalle}
        selected={metaSelected}
        userId={userInfo?.userId}
        data={finantialGoals}
        userInfo={userInfo}
      />
    </NativeBaseProvider>
  );
};
export default Finanzas;
