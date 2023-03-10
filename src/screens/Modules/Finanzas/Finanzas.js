import React, {useState, useEffect} from 'react';
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
  Menu,
  Pressable,
  Badge,
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import ModalCrearFinanzas from '../../../components/Finanzas/ModalCrearFinanzas';
import ModalAgregarMonto from '../../../components/Finanzas/ModalAgregarMonto';
import ModalDetalleFinanzas from '../../../components/Finanzas/ModalDetalleFinanzas';
import StudiallyProModal from '../../../components/StudiallyProModal';
import {useUser} from '../../../context/User';

const Finanzas = () => {
  // get user data
  const {userInfo, userTier, user} = useUser();

  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);

  // Estado modal crear
  const [crearModalVisibility, setCrearModalVisibility] = React.useState(false);

  // Estado modal monto
  const [montoModalVisibility, setMontoModalVisibility] = React.useState(false);

  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);

  // Estado de cual se modifica
  const [metaSelected, setMetaSelected] = React.useState(0);
  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  // index
  const [index, setIndex] = React.useState(0);

  // Finanzas states
  const [finantialGoals, setFinantialGoals] = useState([]);

  //Funcion para sacar los hábitos
  const getFinance = userInfo => {
    const userFinantialGoals = userInfo.finanzas;
    setFinantialGoals(userFinantialGoals);
  };

  const deleteFinance = id => {
    const deleted = [...finantialGoals];
    deleted.splice(id, 1);
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          finanzas: deleted,
        })
        .then(() => {
          console.log('User finantial goals updated!');
          setFinantialGoals(deleted);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect para iniciar con las metas agregadas
  useEffect(() => {
    if (userInfo) {
      getFinance(userInfo);
    }
  }, [userInfo]);

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
          {finantialGoals.length < 3 ? (
            <>
              {userTier !== 'premium' ? (
                <Badge
                  colorScheme="danger"
                  rounded="full"
                  // mb={4}
                  // mr={0}
                  position="absolute"
                  right={30}
                  bottom={135}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 15,
                  }}>
                  Pro
                </Badge>
              ) : null}
              <Fab
                position="absolute"
                size="sm"
                icon={<AntIcon color="white" name="plus" size={20} />}
                right={30}
                bottom={90}
                bg="#061678"
                onPress={() =>
                  userTier !== 'premium'
                    ? setProModalVisibility(true)
                    : setCrearModalVisibility(true)
                }
              />
            </>
          ) : null}

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
                  <HStack
                    flexDirection="row"
                    justifyContent="space-between"
                    w="100%"
                    h="45px"
                    alignItems="flex-start">
                    <Text textAlign="left" color="#061678" fontSize="20px">
                      {item.nombre}
                    </Text>
                    <Menu
                      w="190"
                      trigger={triggerProps => {
                        return (
                          <Pressable
                            accessibilityLabel="More options menu"
                            {...triggerProps}>
                            <Icon
                              size={20}
                              color="#475BD8"
                              name="dots-vertical"
                            />
                          </Pressable>
                        );
                      }}>
                      <Menu.Item
                        onPress={() => {
                          setDetalleModalVisibility(true);
                          setDataDetalle(item);
                          setIndex(i);
                        }}>
                        Editar
                      </Menu.Item>
                      <Menu.Item onPress={() => deleteFinance(i)}>
                        <Text color="red.400">Eliminar</Text>
                      </Menu.Item>
                    </Menu>
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
                    alignContent="center"
                    justifyContent="center"
                    alignItems="center"
                    w={'100%'}>
                    <Text fontSize="18" color="#475BD8">
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
        userId={user.uid}
        data={finantialGoals}
        userInfo={userInfo}
        //reloadGoals={reloadGoals}
      />
      <ModalAgregarMonto
        modalVisibility={montoModalVisibility}
        setModalVisibility={setMontoModalVisibility}
        setData={setDataDetalle}
        selected={metaSelected}
        userId={user.uid}
        data={finantialGoals}
        userInfo={userInfo}
      />
      <ModalDetalleFinanzas
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        setData={setFinantialGoals}
        dataDetalle={dataDetalle}
        userId={user.uid}
        data={finantialGoals}
        index={index}
      />
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
    </NativeBaseProvider>
  );
};
export default Finanzas;
