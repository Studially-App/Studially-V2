//import React from 'react';
import * as React from 'react';
import {useState, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  Text,
  HStack,
  NativeBaseProvider,
  VStack,
  Button,
  Select,
  Input,
  Pressable,
  View,
  Center,
  Circle,
  Heading,
  useToast,
  ScrollView,
} from 'native-base';

import {useNavigation} from '@react-navigation/native';

// React Native
import {useWindowDimensions} from 'react-native';

// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Modal
import BreakTimeModal from '../../../components/Enfoque/BreakTimeModal';
import FocusFinishedModal from '../../../components/Enfoque/FocusFinishedModal';
import StopModal from '../../../components/Enfoque/StopModal';

import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import uuid from 'react-native-uuid';

const Enfoque = () => {
  const navigation = useNavigation();

  // get user data
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  // Toast
  const toast = useToast();
  // Screen Dimentions
  const {width, height} = useWindowDimensions();
  // Timer ON State
  const [timerOn, setTimerOn] = useState(false);
  // Timer Start State
  const [timerStart, setTimerStart] = useState(false);
  // TimetKey
  const [timerKey, setTimerKey] = useState(uuid.v4().slice(0, 13));
  // timer input
  const [timerInput, setTimerInput] = useState(0);
  // Timer minut input
  const [inputMin, setInputMin] = useState(25);
  // Timer seconds input
  const [inputSec, setInputSec] = useState(0);
  // Placeholder Timer
  const placeholder = '00';
  // Stop Modal Visibility
  const [stopModalVisibility, setStopModalVisibility] = useState(false);
  // Break Time Modal Visibility
  const [breakTimeModalVisibility, setBreakTimeModalVisibility] =
    useState(false);
  // Focus finished Modal Visibility
  const [focusFinishedModalVisibility, setFocusFinishedModalVisibility] =
    useState(false);
  // Categoria
  const [category, setCategory] = useState('');
  // BreakOut Active
  const [breakOutActive, setBreakOutActive] = useState(false);
  // Break Out TimerOn
  const [breakOutOn, setBreakOutOn] = useState(false);
  // BreakOut Timer key
  const breakOutKey = uuid.v4().slice(0, 13);
  // Input value
  const [minutsInput, setMinutsInput] = useState('5');
  // BreakOut time
  const [breakOutTime, setBreakOutTime] = useState(null);
  // Stars to get gifts
  const [studiallyStars, setStudiallyStars] = useState(0);

  // Reiniciar timer
  const restartTimer = () => {
    const key = uuid.v4().slice(0, 13);
    setTimerKey(key);
    setTimerOn(false);
    setTimerStart(false);
    setInputMin(25);
    setInputSec(0);
    setTimerInput(0);
    setBreakOutOn(false);
    setBreakOutActive(false);
  };

  // Set time
  const setTimer = () => {
    const totalTime = parseInt(inputMin, 10) * 60 + parseInt(inputSec, 10);
    setTimerInput(totalTime);
    setTimerOn(true);
    setTimerStart(true);
  };

  const countStars = async minutosTotal => {
    const stars = Math.floor(minutosTotal / 6);
    try {
      await firestore().collection('usuarios').doc(userInfo.userId).update({
        estrellas: stars,
      });
      setStudiallyStars(stars);
    } catch (error) {
      console.log(error);
    }
  };

  const countMinutes = async () => {
    const calculatedMinutes = Math.floor(timerInput / 60);
    const minutesDB = [...userInfo.minutos];
    let minutosTotal = userInfo.minutosTotales;

    let index = minutesDB.findIndex(object => {
      return object.categoria === category;
    });

    minutesDB[index].minutos = minutesDB[index].minutos + calculatedMinutes;
    minutesDB[index].minutosSemana =
      minutesDB[index].minutosSemana + calculatedMinutes;
    minutosTotal = minutosTotal + calculatedMinutes;

    countStars(minutosTotal);

    try {
      firestore()
        .collection('usuarios')
        .doc(userInfo.userId)
        .update({
          minutos: minutesDB,
          minutosTotales: minutosTotal,
        })
        .then(() => {
          console.log('User minutes updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getStars = (userInfo, mounted) => {
    if (mounted) {
      if (userInfo) {
        var estrellas = userInfo.estrellas;
        setStudiallyStars(estrellas);
      }
    }
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
      return () => {
        isMounted = false;
      };
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (userInfo !== undefined) {
      getStars(userInfo, isMounted);
      return () => {
        isMounted = false;
      };
    }
  }, [userInfo]);

  if (initializing) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <StopModal
        stopModalVisibility={stopModalVisibility}
        setStopModalVisibility={setStopModalVisibility}
        restartTimer={restartTimer}
      />
      <FocusFinishedModal
        focusFinishedModalVisibility={focusFinishedModalVisibility}
        setFocusFinishedModalVisibility={setFocusFinishedModalVisibility}
        setBreakTimeModalVisibility={setBreakTimeModalVisibility}
      />
      <BreakTimeModal
        breakTimeModalVisibility={breakTimeModalVisibility}
        setBreakTimeModalVisibility={setBreakTimeModalVisibility}
        setBreakOutActive={setBreakOutActive}
        setMinutsInput={setMinutsInput}
        minutsInput={minutsInput}
        breakOutTime={breakOutTime}
        setBreakOutTime={setBreakOutTime}
        setBreakOutOn={setBreakOutOn}
      />
      <View h={height} width={width}>
        <VStack space={4} justifyContent="center">
          <ScrollView w="100%" h="88%">
            <Center mt="6">
              <Button
                onPress={() => {
                  navigation.navigate('Estadisticas');
                }}
                bg="rgba(71, 91, 216, 1)"
                mb={2}
                rightIcon={
                  <MaterialIcon
                    name="show-chart"
                    size={16}
                    color="rgba(255, 255, 255, 1.0)"
                  />
                }>
                Estadísticas
              </Button>
              <HStack
                justifyContent="space-around"
                w="100%"
                alignItems="center"
                mb={2}>
                <Button
                  onPress={() => {
                    navigation.navigate('Rewards', {stars: studiallyStars});
                  }}
                  borderColor="rgba(71, 91, 216, 1)"
                  bg={'white'}
                  borderWidth={1}>
                  <Text fontSize={16} color="rgba(71, 91, 216, 1)">
                    Redimir puntos
                  </Text>
                </Button>
                <Text fontSize={20} fontWeight="bold">
                  {studiallyStars}
                  <MaterialIcon
                    name="star-outline"
                    size={20}
                    color="rgba(71, 91, 216, 1)"
                  />
                </Text>
              </HStack>
              <Text fontSize={18} fontWeight="bold">
                Edita tu tiempo de enfoque
              </Text>
            </Center>
            <Center>
              {breakOutActive === false ? (
                <CountdownCircleTimer
                  isPlaying={timerOn}
                  duration={timerInput}
                  key={timerKey}
                  updateInterval={1}
                  colors="rgba(71, 91, 216, 1)"
                  size={240}
                  onComplete={() => {
                    restartTimer();
                    setFocusFinishedModalVisibility(true);
                    countMinutes();
                  }}
                  children={({remainingTime}) => {
                    if (remainingTime === 0) {
                      return (
                        <HStack alignItems="center">
                          <Center w={'150'}>
                            <Input
                              placeholder={placeholder}
                              defaultValue="25"
                              variant="unstyled"
                              fontSize={48}
                              size="2xl"
                              maxLength={2}
                              textAlign="center"
                              keyboardType="numeric"
                              marginLeft={'50%'}
                              onChangeText={text => setInputMin(text)}
                            />
                            <Text
                              fontSize="10"
                              marginLeft={'50%'}
                              color={timerStart === true ? 'black' : '#a3a3a3'}>
                              min
                            </Text>
                          </Center>
                          <Text
                            fontSize="48"
                            color={timerStart === true ? 'black' : '#a3a3a3'}>
                            :
                          </Text>
                          <Center w={'150'}>
                            <Input
                              placeholder={placeholder}
                              defaultValue="00"
                              variant="unstyled"
                              textAlign="center"
                              keyboardType="numeric"
                              fontSize={48}
                              size="2xl"
                              maxLength={2}
                              marginRight={'50%'}
                              onChangeText={text => setInputSec(text)}
                            />
                            <Text
                              fontSize="10"
                              marginRight={'50%'}
                              color={timerStart === true ? 'black' : '#a3a3a3'}>
                              seg
                            </Text>
                          </Center>
                        </HStack>
                      );
                    }
                    if (timerStart === true) {
                      const minutes = Math.floor(remainingTime / 60);
                      const seconds = remainingTime % 60;
                      return seconds < 10 && minutes >= 10 ? (
                        <Text fontSize="48">
                          {minutes}:0{seconds}
                        </Text>
                      ) : seconds < 10 && minutes < 10 ? (
                        <Text fontSize="48">
                          0{minutes}:0{seconds}
                        </Text>
                      ) : seconds >= 10 && minutes < 10 ? (
                        <Text fontSize="48">
                          0{minutes}:{seconds}
                        </Text>
                      ) : (
                        <Text fontSize="48">
                          {minutes}:{seconds}
                        </Text>
                      );
                    }
                    // return <Input />;
                  }}
                />
              ) : (
                <CountdownCircleTimer
                  isPlaying={breakOutOn}
                  duration={breakOutTime}
                  key={breakOutKey}
                  updateInterval={1}
                  colors="rgba(71, 91, 216, 1)"
                  size={240}
                  onComplete={() => {
                    setBreakOutActive(false);
                  }}
                  children={({remainingTime}) => {
                    if (breakOutOn === true) {
                      const minutes = Math.floor(remainingTime / 60);
                      const seconds = remainingTime % 60;
                      return seconds < 10 && minutes >= 10 ? (
                        <Text fontSize="48">
                          {minutes}:0{seconds}
                        </Text>
                      ) : seconds < 10 && minutes < 10 ? (
                        <Text fontSize="48">
                          0{minutes}:0{seconds}
                        </Text>
                      ) : seconds >= 10 && minutes < 10 ? (
                        <Text fontSize="48">
                          0{minutes}:{seconds}
                        </Text>
                      ) : (
                        <Text fontSize="48">
                          {minutes}:{seconds}
                        </Text>
                      );
                    }
                  }}
                />
              )}
            </Center>
            <HStack justifyContent="center" space="2">
              <Center>
                {breakOutActive === false &&
                timerOn === false &&
                timerStart === false ? (
                  <Center>
                    <Pressable
                      onPress={() => {
                        if (
                          category.length !== 0 &&
                          (inputMin !== 0 || inputSec !== 0)
                        ) {
                          setTimer();
                        }
                        if (inputMin === 0 && inputSec === 0) {
                          return toast.show({
                            description: 'Elija la duración',
                            duration: 1500,
                            placement: 'top',
                          });
                        }
                        if (category.length === 0) {
                          toast.show({
                            description: 'Seleccione una categoría',
                            duration: 1500,
                            placement: 'top',
                          });
                        }
                      }}>
                      <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                        <MaterialIcon
                          name="play-arrow"
                          size={32}
                          color="rgba(255, 255, 255, 1.0)"
                        />
                      </Circle>
                    </Pressable>
                  </Center>
                ) : breakOutActive === false &&
                  timerOn === true &&
                  timerStart === true ? (
                  <HStack space="2">
                    <Center>
                      <Pressable
                        onPress={() => {
                          setTimerOn(false);
                        }}>
                        <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                          <Ionicons
                            name="pause"
                            size={26}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Circle>
                      </Pressable>
                    </Center>
                    <Center>
                      <Pressable
                        onPress={() => {
                          // setTimerOn(false);
                          // restartTimer();
                          setStopModalVisibility(true);
                        }}>
                        <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                          <Ionicons
                            name="stop"
                            size={26}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Circle>
                      </Pressable>
                    </Center>
                  </HStack>
                ) : breakOutActive === false &&
                  timerOn === false &&
                  timerStart === true ? (
                  <HStack space="2">
                    <Center>
                      <Pressable
                        onPress={() => {
                          setTimerOn(true);
                        }}>
                        <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                          <MaterialIcon
                            name="play-arrow"
                            size={32}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Circle>
                      </Pressable>
                    </Center>
                    <Center>
                      <Pressable
                        onPress={() => {
                          // setTimerOn(false);
                          setStopModalVisibility(true);
                        }}>
                        <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                          <Ionicons
                            name="stop"
                            size={26}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Circle>
                      </Pressable>
                    </Center>
                  </HStack>
                ) : breakOutActive === true ? (
                  <Pressable
                    onPress={() => {
                      // setTimerOn(false);
                      setStopModalVisibility(true);
                    }}>
                    <Circle size="48px" bg="rgba(71, 91, 216, 1)">
                      <Ionicons
                        name="stop"
                        size={26}
                        color="rgba(255, 255, 255, 1.0)"
                      />
                    </Circle>
                  </Pressable>
                ) : null}
              </Center>
            </HStack>
            {breakOutActive === false ? (
              <VStack alignItems="flex-start" px="8" space={2}>
                <Heading>Categoría</Heading>
                <Select
                  placeholder="Categoría"
                  rounded="4"
                  size="lg"
                  w={200}
                  onValueChange={itemValue => setCategory(itemValue)}
                  selectedValue={category}>
                  <Select.Item value="Académico" label="Académico" />
                  <Select.Item value="Proyectos" label="Proyectos" />
                  <Select.Item value="Personal" label="Personal" />
                  <Select.Item value="Trabajo" label="Trabajo" />
                  <Select.Item value="Aprendizaje" label="Aprendizaje" />
                </Select>
              </VStack>
            ) : (
              <VStack alignItems="flex-start" px="8" space={2}>
                <Text noOfLines={3}>
                  Después del tiempo de descanso podrás iniciar un tiempo de
                  enfoque nuevamente.
                </Text>
              </VStack>
            )}
          </ScrollView>
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};
export default Enfoque;
