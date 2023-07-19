/* eslint-disable no-shadow */
import * as React from 'react';
import { useState, useEffect } from 'react';
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
  Badge,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';

// React Native
import { useWindowDimensions } from 'react-native';

// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import notifee from '@notifee/react-native';

// Modal
import BreakTimeModal from '../../../components/Enfoque/BreakTimeModal';
import FocusFinishedModal from '../../../components/Enfoque/FocusFinishedModal';
import StopModal from '../../../components/Enfoque/StopModal';
import StudiallyProModal from '../../../components/StudiallyProModal';


import BackgroundTimer from 'react-native-background-timer';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import uuid from 'react-native-uuid';
import dayjs from 'dayjs';
import { useUser } from '../../../context/User';
let weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);

const Enfoque = () => {
  const navigation = useNavigation();

  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);
  const { userInfo, userTier, user } = useUser();

  // Toast
  const toast = useToast();
  // Screen Dimentions
  const { width, height } = useWindowDimensions();
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
  // Stats minutes
  const [minutesStats, setMinutesStats] = useState([]);
  // Máximo 6 horas al día
  const [minutesLimit, setMinutesLimit] = useState(0);

  const [remainingTime, setRemainingTime] = useState(0);


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

  const displayNotifications = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Enfoque completo',
      lights: false,
      vibration: true,
    });
    await notifee.displayNotification({
      title: 'Importante',
      body: 'Tiempo completado: “Studialler, has completado tu tiempo de organización',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        critical: true,
        sound: 'local.wav',
      },
    });
  }

  // Set time
  const setTimer = async () => {
    let totalTime = parseInt(inputMin, 10) * 60 + parseInt(inputSec, 10);
    setRemainingTime(totalTime); // Set remainingTime with totalTime
    if (dayjs().day() === userInfo.minutosHoyDia) {
      if (userInfo.minutosHoy + totalTime / 60 < 360) {
        setTimerInput(totalTime);
        setTimerOn(true);
        setTimerStart(true);
        // Start the background timer
        BackgroundTimer.runBackgroundTimer(() => {
          // this will be executed every 1000 ms
          // decrement the time remaining by one second
          if (totalTime > 0) {
            setRemainingTime(time => {
              totalTime = time - 1;
              return totalTime;
            });
          } 
        }, 1000);
        // if remaining time is zero, stop the timer
        if (totalTime <= 0) {
          BackgroundTimer.stopBackgroundTimer();
          displayNotifications();
          setRemainingTime(0); // Reset remainingTime
        }
      } else {
        toast.show({
          description: 'No puedes tener más de 6 horas de enfoque al día',
          duration: 1500,
          placement: 'top',
        });
      }
    } else {
      try {
        await firestore().collection('usuarios').doc(user.uid).update({
          minutosHoyDia: dayjs().day(),
          minutosHoy: 0,
        });
      } catch (error) {
        console.log(error);
      }
      setTimerInput(totalTime);
      setTimerOn(true);
      setTimerStart(true);
      setMinutesLimit(0);
      // Start the background timer
      BackgroundTimer.runBackgroundTimer(() => {
        // this will be executed every 1000 ms
        // decrement the time remaining by one second
        if (totalTime > 0) {
          setRemainingTime(time => {
            totalTime = time - 1;
            return totalTime;
          });
        } 
      }, 1000);
      // if remaining time is zero, stop the timer
      if (totalTime <= 0) {
        BackgroundTimer.stopBackgroundTimer();
        displayNotifications();
        setRemainingTime(0); // Reset remainingTime
      }
    }
  };


  const countStars = async minutosTotal => {
    const stars = Math.floor(minutosTotal / 6);
    try {
      await firestore().collection('usuarios').doc(user.uid).update({
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

    console.log('Minutes DB', minutesDB);
    console.log('Calculated', calculatedMinutes);

    let index = minutesDB.findIndex(object => {
      return object.categoria === category;
    });

    console.log('Index', index);

    if (dayjs().month() === userInfo.minutosMes) {
      minutesDB[index].minutos = minutesDB[index].minutos + calculatedMinutes;
      console.log('Minutes DB Meses', minutesDB);
    } else {
      minutesDB.map(cat => {
        cat.minutos = 0;
      });
      minutesDB[index].minutos = minutesDB[index].minutos + calculatedMinutes;
    }

    if (dayjs(new Date()).week() === userInfo.minutosSemana) {
      minutesDB[index].minutosSemana =
        minutesDB[index].minutosSemana + calculatedMinutes;
      console.log('Minutes DB semanas', minutesDB);
    } else {
      minutesDB.map(cat => {
        cat.minutosSemana = 0;
      });
      minutesDB[index].minutosSemana =
        minutesDB[index].minutosSemana + calculatedMinutes;
    }

    const newData = await firestore()
      .collection('usuarios')
      .doc(user.uid)
      .get();
    let minutosTotal = newData._data.minutosTotales;
    minutosTotal = minutosTotal + calculatedMinutes;
    let limite = minutesLimit;
    limite = limite + calculatedMinutes;

    countStars(minutosTotal);
    setMinutesStats(minutesDB);
    setMinutesLimit(limite);

    try {
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          minutos: minutesDB,
          minutosTotales: minutosTotal,
          minutosHoy: limite,
          minutosMes: dayjs().month(),
          minutosSemana: dayjs(new Date()).week(),
          minutosHoyDia: dayjs().day(),
        })
        .then(() => {
          console.log('User minutes updated!');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getStars = userInfo => {
    setStudiallyStars(userInfo.estrellas);
  };

  const getMinutesStats = (userInfo, mounted) => {
    const minutesDB = [...userInfo.minutos];
    setMinutesStats(minutesDB);
  };

  useEffect(() => {
    if (userInfo) {
      getStars(userInfo);
      getMinutesStats(userInfo);
    }
  }, [userInfo]);

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
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
      <ScrollView w={width} h={'80%'} mb={20} position="absolute">
        <VStack space={4} justifyContent="center">
          <Center mt="6">
            {userTier !== 'premium' ? (
              <Badge
                colorScheme="danger"
                rounded="full"
                mb={-2}
                mr={150}
                zIndex={1}
                variant="solid"
                alignSelf="flex-end"
                _text={{
                  fontSize: 15,
                }}>
                Pro
              </Badge>
            ) : null}
            <Button
              onPress={() => {
                if (userTier !== 'premium') {
                  setProModalVisibility(true);
                } else {
                  navigation.navigate('Estadisticas', {
                    minutes: minutesStats,
                    userInfo: userInfo
                  });
                }
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
                  navigation.navigate('Rewards', {
                    stars: studiallyStars,
                    userTier,
                  });
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
                size={170}
                onComplete={() => {
                  restartTimer();
                  setFocusFinishedModalVisibility(true);
                  countMinutes();
                  displayNotifications();
                }}
                children={({ remainingTime }) => {
                  if (remainingTime === 0) {
                    return (
                      <HStack alignItems="center">
                        <Center w={'150'}>
                          <Input
                            placeholder={placeholder}
                            defaultValue="25"
                            variant="unstyled"
                            fontSize={30}
                            size="lg"
                            maxLength={2}
                            textAlign="center"
                            keyboardType="numeric"
                            marginLeft={'50%'}
                            onChangeText={text =>
                              text ? setInputMin(text) : setInputMin(0)
                            }
                          />
                          <Text
                            fontSize="10"
                            marginLeft={'50%'}
                            color={timerStart === true ? 'black' : '#a3a3a3'}>
                            min
                          </Text>
                        </Center>
                        <Text
                          fontSize="25"
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
                            fontSize={30}
                            size="lg"
                            maxLength={2}
                            marginRight={'50%'}
                            onChangeText={text =>
                              text ? setInputSec(text) : setInputSec(0)
                            }
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
                      <Text fontSize="30">
                        {minutes}:0{seconds}
                      </Text>
                    ) : seconds < 10 && minutes < 10 ? (
                      <Text fontSize="30">
                        0{minutes}:0{seconds}
                      </Text>
                    ) : seconds >= 10 && minutes < 10 ? (
                      <Text fontSize="30">
                        0{minutes}:{seconds}
                      </Text>
                    ) : (
                      <Text fontSize="30">
                        {minutes}:{seconds}
                      </Text>
                    );
                  }
                }}
              />
            ) : (
              <CountdownCircleTimer
                isPlaying={breakOutOn}
                duration={breakOutTime}
                key={breakOutKey}
                updateInterval={1}
                colors="rgba(71, 91, 216, 1)"
                size={170}
                onComplete={() => {
                  setBreakOutActive(false);
                }}
                children={({ remainingTime }) => {
                  if (breakOutOn === true) {
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    return seconds < 10 && minutes >= 10 ? (
                      <Text fontSize="30">
                        {minutes}:0{seconds}
                      </Text>
                    ) : seconds < 10 && minutes < 10 ? (
                      <Text fontSize="30">
                        0{minutes}:0{seconds}
                      </Text>
                    ) : seconds >= 10 && minutes < 10 ? (
                      <Text fontSize="30">
                        0{minutes}:{seconds}
                      </Text>
                    ) : (
                      <Text fontSize="30">
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
              <Heading fontSize={20}>Categoría</Heading>
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
        </VStack>
      </ScrollView>
      {/* </View> */}
    </NativeBaseProvider>
  );
};
export default Enfoque;
