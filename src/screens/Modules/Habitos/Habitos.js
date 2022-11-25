import React, {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {ScrollView} from 'react-native';

import {
  Text,
  HStack,
  NativeBaseProvider,
  VStack,
  Button,
  Pressable,
  Spacer,
  Box,
  Modal,
  Spinner,
  Heading,
  Divider,
} from 'native-base';

import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';

import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

import ModalAgregarAmigo from '../../../components/Habitos/ModalAgregarAmigo';

const Habitos = () => {
  const navigation = useNavigation();

  const [tab, setTab] = React.useState('Mis Habitos');

  const [data, setData] = React.useState([]);

  const [todayData, setTodayData] = React.useState([]);

  const [selectedData, setSelectedData] = React.useState([]);

  const [habitosTendencia, setHabitosTendencia] = React.useState([]);

  const [spinnerModal, setSpinnerModal] = useState(false);

  const [fuegos, setFuegos] = useState(0);
  const [amigos, setAmigos] = useState([]);

  // Estado modal amigo
  const [amigoModalVisibility, setAmigoModalVisibility] = React.useState(false);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  const marcarHabito = (i, accion, name) => {
    let marcado = [...todayData];
    let markedData = [...data];
    let index = data.findIndex(object => {
      return object.name === name;
    });
    if (accion === 'Completado') {
      marcado[i].completed = true;
      marcado[i].marked = true;
      markedData[index].marcadoSemana.push(1);
      markedData[index].marcadoMes.push(1);
      setData(markedData);
    } else {
      marcado[i].marked = true;
    }
    setTodayData(marcado);
  };

  const desmarcarHabito = i => {
    let desmarcado = [...todayData];
    desmarcado[i].completed = false;
    desmarcado[i].marked = false;
    setTodayData(desmarcado);
  };

  const allMarked = () => {
    let all = [];
    todayData.map(item => {
      item.finalMarked ? all.push('1') : null;
    });
    if (all.length === todayData.length) {
      return true;
    } else {
      return false;
    }
  };

  const saveMarkedHabits = i => {
    let popHabits = [...todayData];
    popHabits[i].finalMarked = true;
    setTodayData(popHabits);
    try {
      firestore()
        .collection('usuarios')
        .doc(userInfo.userId)
        .update({
          habitos: data,
        })
        .then(() => {
          console.log('User habits marked updated!');
          getHabits(userInfo, true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getTodayHabits = selectedHabits => {
    let todayHabits = [];
    let today = dayjs().day() - 1;
    today === -1 ? (today = 6) : null;
    selectedHabits.map(item => {
      dayjs().hour() === 0 ? (item.finalMarked = false) : null;
      item.frecuencia[today] === 1 ? todayHabits.push(item) : null;
    });
    setTodayData(todayHabits);
  };

  const getUserInfo = async (user, mounted) => {
    if (mounted) {
      const userInfoFB = await firestore()
        .collection('usuarios')
        .where('email', '==', user.email)
        .get();
      setUserInfo(userInfoFB._docs[0]._data);
    }
  };

  const getHabitosTendencias = async () => {
    const habitsStats = await firestore()
      .collection('habitos')
      .doc('Personas')
      .get();
    setHabitosTendencia(habitsStats._data.habitos);
  };

  const getHabits = (userInfo, mounted) => {
    if (mounted) {
      if (userInfo) {
        var userHabits = userInfo.habitos;
        setData(userHabits);
        var selectedHabits = [];
        userHabits.map(item =>
          item.selected ? selectedHabits.push(item) : null,
        );
        selectedHabits.map(item => {
          var veces = item.frecuencia.reduce(function (a, b) {
            return a + b;
          }, 0);
          item.veces = veces;
        });
        selectedHabits.map(item => {
          if (dayjs().day() === 1) {
            item.marcadoSemana = [];
          }
          var dias = item.marcadoSemana.reduce(function (a, b) {
            return a + b;
          }, 0);
          item.dias = dias;
        });
        getTodayHabits(selectedHabits);
        setSelectedData(selectedHabits);
        const listaOrdenadaAmigos = userInfo.listaAmigos.reverse(
          (a, b) => a.fuegos - b.fuegos,
        );
        setAmigos(listaOrdenadaAmigos);
        setFuegos(userInfo.fuegos);
      }
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  useEffect(() => {
    let isMounted = true;
    if (user !== undefined) {
      getUserInfo(user, isMounted);
      getHabitosTendencias();
      return () => {
        isMounted = false;
      };
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (userInfo !== undefined) {
      getHabits(userInfo, isMounted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  if (initializing) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <Modal isOpen={spinnerModal}>
        <Spinner color="cyan.500" size="lg" />
        <Heading color="cyan.500" fontSize="md">
          Cargando Hábitos
        </Heading>
      </Modal>
      <VStack space={4} alignItems="center" mt={2}>
        <HStack space={3} justifyContent="center" maxW="90%">
          {tab === 'Mis Habitos' ? (
            <>
              <Button
                onPress={() => setTab('Mis Habitos')}
                bg="#475BD8"
                w={'33%'}>
                <Text fontSize="14" color="white">
                  Mis hábitos
                </Text>
              </Button>
              <Button
                onPress={() => setTab('Marcar Habitos')}
                bg="white"
                w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Hábitos del día
                </Text>
              </Button>
              <Button onPress={() => setTab('Tendencias')} bg="white" w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Tendencias
                </Text>
              </Button>
            </>
          ) : tab === 'Marcar Habitos' ? (
            <>
              <Button
                onPress={() => setTab('Mis Habitos')}
                bg="white"
                w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Mis hábitos
                </Text>
              </Button>
              <Button
                onPress={() => setTab('Marcar Habitos')}
                bg="#475BD8"
                w={'33%'}>
                <Text fontSize="14" color="white">
                  Hábitos del día
                </Text>
              </Button>
              <Button onPress={() => setTab('Tendencias')} bg="white" w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Tendencias
                </Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={() => setTab('Mis Habitos')}
                bg="white"
                w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Mis hábitos
                </Text>
              </Button>
              <Button
                onPress={() => setTab('Marcar Habitos')}
                bg="white"
                w={'33%'}>
                <Text fontSize="14" color="#475BD8">
                  Hábitos del día
                </Text>
              </Button>
              <Button
                onPress={() => setTab('Tendencias')}
                bg="#475BD8"
                w={'33%'}>
                <Text fontSize="14" color="white">
                  Tendencias
                </Text>
              </Button>
            </>
          )}
        </HStack>
      </VStack>
      {tab === 'Mis Habitos' ? (
        /* Aquí es cuando estás en la tab de mis hábitos*/
        Object.keys(selectedData).length === 0 ? (
          <VStack space={4} alignItems="center">
            <Box
              width="90%"
              height="80%"
              bg="transparent"
              p="4"
              mt={3}
              borderWidth={2}
              borderRadius={9}
              borderColor="#061678"
              borderStyle="dashed"
              _text={{
                fontSize: '3xl',
                fontWeight: 'normal',
                color: '#061678',
                textAlign: 'center',
              }}
              alignItems="center"
              justifyContent="center">
              Aún no tienes hábitos en la lista
              <Button
                onPress={() => {
                  console.log('AgregarHabitos');
                  navigation.navigate('Agregar Habitos', {
                    onGoBack: () => {
                      setSpinnerModal(true);
                      getUserInfo(user, true);
                      getHabits(userInfo, true);
                      setSpinnerModal(false);
                    },
                  });
                }}
                bg="#475BD8">
                <Text fontSize="xl" color="white">
                  Agregar hábitos
                </Text>
              </Button>
            </Box>
          </VStack>
        ) : (
          <VStack alignItems="center" mt={1} mb={'25%'}>
            <ScrollView w="100%" h="200px">
              <VStack space={15} alignItems="center" mt={5} mb={10}>
                <Text
                  fontSize="lg"
                  color="black"
                  underline
                  onPress={() => {
                    console.log('Editar hábitos');
                    navigation.navigate('Agregar Habitos', {
                      onGoBack: () => {
                        setSpinnerModal(true);
                        getUserInfo(user, true);
                        getHabits(userInfo, true);
                        setSpinnerModal(false);
                      },
                    });
                  }}>
                  Editar hábitos{' '}
                  <FontistoIcon name="equalizer" size={16} color="#272C46" />{' '}
                </Text>
                <Button
                  onPress={() => navigation.navigate('Estadísticas')}
                  bg="#475BD8"
                  mt={2}
                  rightIcon={
                    <FoundationIcon
                      name="graph-trend"
                      size={30}
                      color="white"
                    />
                  }>
                  <Text fontSize="lg" color="white">
                    Estadisticas
                  </Text>
                </Button>

                {selectedData.map((item, i) => (
                  <Pressable w="100%" alignItems="center" key={i}>
                    <Box
                      width="100%"
                      height="60px"
                      bg="white"
                      p="4"
                      shadow={2}
                      alignItems="center"
                      justifyContent="center"
                      rounded="lg">
                      <HStack space={2} justifyContent="space-around">
                        <Icon size={33} color="#061678" name={item.icono} />
                        <Spacer />
                        <Text fontSize="xl" color="#061678" textAlign="center">
                          {item.name}
                        </Text>
                        <Spacer />
                        <Text fontSize="lg" color="#061678" textAlign="center">
                          {item.dias === item.veces ? (
                            <MCIcon size={35} color="orange" name="fire" />
                          ) : (
                            item.dias + ' / ' + item.veces
                          )}
                        </Text>
                      </HStack>
                    </Box>
                  </Pressable>
                ))}
              </VStack>
            </ScrollView>
          </VStack>
        )
      ) : tab === 'Marcar Habitos' && allMarked() ? (
        <VStack space={4} alignItems="center">
          <Box
            width="90%"
            height="80%"
            bg="transparent"
            p="4"
            marginTop={5}
            borderWidth={2}
            borderRadius={9}
            borderColor="#061678"
            borderStyle="dashed"
            _text={{
              fontSize: '3xl',
              fontWeight: 'normal',
              color: '#061678',
              textAlign: 'center',
            }}
            alignItems="center"
            justifyContent="center">
            ¡Genial! {'\n'} No tienes más hábitos por marcar hoy
          </Box>
        </VStack>
      ) : tab === 'Marcar Habitos' ? (
        /*Aquí es cuando está en la tab de hábitos del día */
        <VStack alignItems="center" mt={3} mb={20}>
          <ScrollView w="100%" h="200px">
            <VStack space={15} alignItems="center">
              {todayData.map((item, i) =>
                item.marked === true ? (
                  item.finalMarked ? null : (
                    <Box
                      width="95%"
                      height="70px"
                      bg="white"
                      p="4"
                      shadow={2}
                      alignItems="center"
                      justifyContent="center"
                      rounded="lg"
                      key={i}>
                      <HStack space={2} justifyContent="space-around">
                        {item.completed === true ? (
                          <Text
                            fontSize="2xl"
                            color="#061678"
                            textAlign="center">
                            Completado
                          </Text>
                        ) : (
                          <Text
                            fontSize="2xl"
                            color="#061678"
                            textAlign="center">
                            No Completado
                          </Text>
                        )}
                        <Spacer />
                        <Button
                          bg="#475BD8"
                          onPress={() => {
                            desmarcarHabito(i);
                          }}>
                          <Text fontSize="lg" color="white">
                            Deshacer{' '}
                            <Icon size={20} color="white" name="undo" />{' '}
                            <CountdownCircleTimer
                              isPlaying
                              duration={5}
                              colors={['#004777', '#F7B801', '#A30000']}
                              colorsTime={[5, 2, 0]}
                              size={20}
                              strokeWidth={4}
                              onComplete={() => saveMarkedHabits(i)}
                            />
                          </Text>
                        </Button>
                      </HStack>
                    </Box>
                  )
                ) : (
                  <Box
                    width="95%"
                    height="70px"
                    bg="white"
                    p="4"
                    shadow={2}
                    alignItems="center"
                    justifyContent="center"
                    rounded="lg"
                    key={i}>
                    <HStack space={2} justifyContent="space-around">
                      <Icon size={40} color="#061678" name={item.icono} />
                      <Spacer />
                      <Text fontSize="2xl" color="#061678" textAlign="center">
                        {item.name}
                      </Text>
                      <Spacer />
                      <MCIcon
                        size={35}
                        color="#D26908"
                        name="close-circle"
                        onPress={() => {
                          marcarHabito(i, 'No Completado', item.name);
                        }}
                      />
                      <Icon
                        size={35}
                        color="#23C820"
                        name="check-circle"
                        onPress={() => {
                          marcarHabito(i, 'Completado', item.name);
                        }}
                      />
                    </HStack>
                  </Box>
                ),
              )}
            </VStack>
          </ScrollView>
        </VStack>
      ) : (
        <VStack mt={3} mb={20} ml={3} mr={3}>
          <HStack justifyContent="space-between">
            <Text fontSize={20} fontWeight="bold">
              Amigos en tendencias{' '}
              <FontIcon name="refresh" size={20} color="#061678" />
            </Text>
            <Text
              fontSize={20}
              fontWeight="bold"
              onPress={() => setAmigoModalVisibility(true)}>
              <IonIcon size={30} color="#061678" name="people-circle-sharp" />
            </Text>
          </HStack>
          {amigos.map((amigo, i) => (
            <HStack justifyContent="space-between" key={i}>
              <Text fontSize={15}>
                {amigo.nombres} {amigo.apellidos}
              </Text>
              <Text fontSize={15}>{amigo.fuegos}</Text>
            </HStack>
          ))}
          <Divider my={2} />
          <Text fontSize={20} fontWeight="bold">
            Hábitos en tendencia
          </Text>
          <HStack justifyContent="space-between">
            <Text fontSize={15} fontWeight="bold">
              Hábito
            </Text>
            <Text fontSize={15} fontWeight="bold">
              Personas
            </Text>
          </HStack>
          {habitosTendencia.map((habito, i) => (
            <HStack justifyContent="space-between" key={i}>
              <Text fontSize={15}>{habito.name}</Text>
              <Text fontSize={15}>{habito.persons}</Text>
            </HStack>
          ))}
        </VStack>
      )}
      <ModalAgregarAmigo
        modalVisibility={amigoModalVisibility}
        setModalVisibility={setAmigoModalVisibility}
        amigos={amigos}
        setAmigos={setAmigos}
        userId={userInfo?.userId}
      />
    </NativeBaseProvider>
  );
};
export default Habitos;
