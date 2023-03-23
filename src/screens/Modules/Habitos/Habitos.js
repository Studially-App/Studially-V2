import React, {useState, useEffect, useCallback} from 'react';
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
  Divider,
  Menu,
  Badge,
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
import StudiallyProModal from '../../../components/StudiallyProModal';
import {useUser} from '../../../context/User';

const Habitos = () => {
  const navigation = useNavigation();

  const [tab, setTab] = React.useState('Mis Habitos');

  const [data, setData] = React.useState([]);

  const [todayData, setTodayData] = React.useState([]);

  const [selectedData, setSelectedData] = React.useState([]);

  const [habitosTendencia, setHabitosTendencia] = React.useState([]);

  const [fuegos, setFuegos] = useState({});
  const [amigos, setAmigos] = useState([]);

  const [fireList, setFireList] = useState([]);

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  // Estado modal amigo
  const [amigoModalVisibility, setAmigoModalVisibility] = React.useState(false);

  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);

  // Set an initializing state whilst Firebase connects
  const {user, userInfo, userTier} = useUser();

  const marcarHabito = (i, accion, name) => {
    console.log('Que es i', i);
    console.log('name',name);
    console.log('accion', accion);
    let marcado = [...todayData];
    marcado[i].marked = true;
    marcado[i].dayMarked = dayjs().date();

    let markedData = [...data];
    let storedHabits = [...selectedData];
    let index = data.findIndex(object => {
      return object.name === name;
    });
    let selectedIndex = storedHabits.findIndex(object => {
      return object.name === name;
    });
    console.log(selectedIndex)
    console.log('Aquí se guarda el fuego',storedHabits[selectedIndex]);
    if (accion === 'Completado') {
      marcado[i].completed = true;
      markedData[index].marcadoSemana.push(1);
      markedData[index].marcadoMes.push(1);
      storedHabits[selectedIndex].dias++;
      console.log('Aquí ya está guardado el fuego',storedHabits[selectedIndex]);
      if (
        storedHabits[selectedIndex].dias === storedHabits[selectedIndex].veces
      ) {
        try {
          updateFire();
        } catch (error) {
          console.log('error en catch', error);
        }
      }
      setSelectedData(storedHabits);
      setData(markedData);
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
    console.log('Hábito a marcar',popHabits[i]);
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          habitos: data,
        })
        .then(() => {
          console.log('User habits marked updated!');
          setTodayData(popHabits);
          getHabits(userInfo);
        });
    } catch (error) {
      console.log('cae en error en marcar hábitos')
      console.log(error);
    }
  };

  const getTodayHabits = selectedHabits => {
    let todayHabits = [];
    let today = dayjs().day() - 1;
    today === -1 ? (today = 6) : null;
    selectedHabits.map(item => {
      if (dayjs().date() !== item.dayMarked) {
        item.finalMarked = false;
        item.marked = false;
      }
      item.frecuencia[today] === 1 ? todayHabits.push(item) : null;
    });
    setTodayData(todayHabits);
  };

  const getHabitosTendencias = async () => {
    const habitsStats = await firestore()
      .collection('habitos')
      .doc('Personas')
      .get();

    const statsOrdered = habitsStats._data.habitos.sort(
      (a, b) => b.persons - a.persons,
    );

    setHabitosTendencia(statsOrdered);
  };

  const getFires = async () => {
    try {
      const getFuegos = await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .get();
      setFuegos({
        nombres: getFuegos._data.nombres,
        apellidos: getFuegos._data.apellidos,
        fuegos: getFuegos._data.fuegos,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateFire = async () => {
    const fires = {...fuegos};
    fires.fuegos = fires.fuegos + 1;
    setFuegos(fires);
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          fuegos: fires.fuegos,
        })
        .then(() => {
          console.log('Fires updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const refreshFriends = async () => {
    const amigosRefresh = await Promise.all(
      amigos.map(async amigo => {
        try {
          const userInfoFB = await firestore()
            .collection('usuarios')
            .where('email', '==', amigo.email)
            .get();
          return {
            nombres: userInfoFB._docs[0]._data.nombres,
            apellidos: userInfoFB._docs[0]._data.apellidos,
            fuegos: userInfoFB._docs[0]._data.fuegos,
            email: userInfoFB._docs[0]._data.email,
          };
        } catch (error) {
          console.log(error);
        }
      }),
    );
    var amigosCleanUndefined = amigosRefresh.filter(x => {
      return x !== undefined;
    });
    const orderedRefresh = amigosCleanUndefined.sort(
      (a, b) => b.fuegos - a.fuegos,
    );
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          listaAmigos: orderedRefresh,
        })
        .then(() => {
          console.log('User friends updated!');
          setAmigos(orderedRefresh);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getHabits = useCallback(async userInfo => {
    var userHabits = userInfo.habitos;
    setData(userHabits);
    var selectedHabits = [];
    userHabits.map(item => (item.selected ? selectedHabits.push(item) : null));
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
    const listaOrdenadaAmigos = userInfo.listaAmigos.sort(
      (a, b) => b.fuegos - a.fuegos,
    );
    setAmigos(listaOrdenadaAmigos);
    setFuegos({
      nombres: userInfo.nombres,
      apellidos: userInfo.apellidos,
      fuegos: userInfo.fuegos,
    });
    setFireList(userInfo.fireHabits);
  }, []);

  useEffect(() => {
    if (user) {
      getHabitosTendencias();
    }
  }, [user]);

  useEffect(() => {
    if (userInfo) {
      getHabits(userInfo);
    }
  }, [getHabits, userInfo]);

  const deleteFriend = id => {
    const deleted = [...amigos];
    deleted.splice(id, 1);
    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          listaAmigos: deleted,
        })
        .then(() => {
          console.log('User friends updated!');
          setAmigos(deleted);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NativeBaseProvider>
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
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
              <Button
                onPress={() => {
                  setTab('Tendencias');
                  refreshFriends();
                  getFires();
                }}
                bg="white"
                w={'33%'}>
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
              <Button
                onPress={() => {
                  setTab('Tendencias');
                  refreshFriends();
                  getFires();
                }}
                bg="white"
                w={'33%'}>
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
                onPress={() => {
                  setTab('Tendencias');
                  refreshFriends();
                  getFires();
                }}
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
                  navigation.navigate('Agregar Habitos');
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
                    navigation.navigate('Agregar Habitos');
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
                    Estadísticas
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
                  item.finalMarked === true ? null : (
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
                          <Text fontSize="md" color="white">
                            Deshacer{' '}
                            <Icon size={20} color="white" name="undo" />{' '}
                            <CountdownCircleTimer
                              isPlaying
                              duration={2}
                              colors={['#004777', '#F7B801', '#A30000']}
                              colorsTime={[2, 1, 0]}
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
                      <Icon size={33} color="#061678" name={item.icono} />
                      <Spacer />
                      <Text fontSize="xl" color="#061678" textAlign="center">
                        {item.name}
                      </Text>
                      <Spacer />
                      <MCIcon
                        size={33}
                        color="#D26908"
                        name="close-circle"
                        onPress={() => {
                          marcarHabito(i, 'No Completado', item.name);
                        }}
                      />
                      <Icon
                        size={33}
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
        <ScrollView w="100%" h="200px">
          <VStack mt={3} mb={20} ml={3} mr={3}>
            <HStack justifyContent="space-between">
              <Text fontSize={20} fontWeight="bold">
                Mi racha del mes ({meses[dayjs().month()]})
              </Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text fontSize={15}>
                {fuegos.nombres} {fuegos.apellidos}
              </Text>
              <Text fontSize={15}>
                {fuegos.fuegos}{' '}
                <MCIcon
                  size={20}
                  color="orange"
                  name="fire"
                  onPress={() => getFires()}
                />
              </Text>
            </HStack>
            <Divider my={2} />
            <HStack justifyContent="space-between">
              <Text fontSize={20} fontWeight="bold">
                Amigos{' '}
                <FontIcon
                  name="refresh"
                  size={20}
                  color="#061678"
                  onPress={() => refreshFriends()}
                />
              </Text>
              <Text
                fontSize={20}
                fontWeight="bold"
                onPress={() => {
                  userTier !== 'premium'
                    ? setProModalVisibility(true)
                    : setAmigoModalVisibility(true);
                }}>
                {userTier !== 'premium' ? (
                  <Badge
                    colorScheme="danger"
                    rounded="full"
                    mb={4}
                    mr={0}
                    zIndex={1}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 15,
                    }}>
                    Pro
                  </Badge>
                ) : null}
                <IonIcon size={30} color="#061678" name="people-circle-sharp" />
              </Text>
            </HStack>
            {amigos.map((amigo, i) => (
              <HStack
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                key={i}>
                <Text fontSize={15}>
                  <Box
                    borderStyle="solid"
                    borderColor="#061678"
                    borderRadius="100"
                    borderWidth="2"
                    justifyContent="center"
                    alignItems="center">
                    <Text w="18px" h="18px" textAlign="center" color="black">
                      {i + 1}
                    </Text>
                  </Box>{' '}
                  {amigo.nombres} {amigo.apellidos}
                </Text>
                <HStack>
                  <Text fontSize={15}>
                    {amigo.fuegos}{' '}
                    <MCIcon size={20} color="orange" name="fire" />
                  </Text>
                  <Menu
                    w="190"
                    trigger={triggerProps => {
                      return (
                        <Pressable
                          accessibilityLabel="More options menu"
                          {...triggerProps}>
                          <MCIcon
                            size={20}
                            color="#475BD8"
                            name="dots-vertical"
                          />
                        </Pressable>
                      );
                    }}>
                    <Menu.Item onPress={() => deleteFriend(i)}>
                      <Text color="red.400">Eliminar</Text>
                    </Menu.Item>
                  </Menu>
                </HStack>
              </HStack>
            ))}
            <Divider my={2} />
            <Text fontSize={20} fontWeight="bold">
              Hábitos en tendencia{' '}
              <FontIcon
                name="refresh"
                size={20}
                color="#061678"
                onPress={() => getHabitosTendencias()}
              />
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
        </ScrollView>
      )}
      <ModalAgregarAmigo
        modalVisibility={amigoModalVisibility}
        setModalVisibility={setAmigoModalVisibility}
        amigos={amigos}
        setAmigos={setAmigos}
        userId={user.uid}
      />
    </NativeBaseProvider>
  );
};
export default Habitos;
