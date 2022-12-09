//import React from 'react';
import * as React from 'react';

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
  // Toast
  const toast = useToast();
  // Screen Dimentions
  const {width, height} = useWindowDimensions();
  // Timer ON State
  const [timerOn, setTimerOn] = React.useState(false);
  // Timer Start State
  const [timerStart, setTimerStart] = React.useState(false);
  // TimetKey
  const [timerKey, setTimerKey] = React.useState(uuid.v4().slice(0, 13));
  // timer input
  const [timerInput, setTimerInput] = React.useState(0);
  // Timer minut input
  const [inputMin, setInputMin] = React.useState(25);
  // Timer seconds input
  const [inputSec, setInputSec] = React.useState(0);
  // Placeholder Timer
  const placeholder = '00';
  // Stop Modal Visibility
  const [stopModalVisibility, setStopModalVisibility] = React.useState(false);
  // Break Time Modal Visibility
  const [breakTimeModalVisibility, setBreakTimeModalVisibility] =
    React.useState(false);
  // Focus finished Modal Visibility
  const [focusFinishedModalVisibility, setFocusFinishedModalVisibility] =
    React.useState(false);
  // Categoria
  const [category, setCategory] = React.useState('');
  // BreakOut Active
  const [breakOutActive, setBreakOutActive] = React.useState(false);
  // Break Out TimerOn
  const [breakOutOn, setBreakOutOn] = React.useState(false);
  // BreakOut Timer key
  const breakOutKey = uuid.v4().slice(0, 13);
  // Input value
  const [minutsInput, setMinutsInput] = React.useState('5');
  // BreakOut time
  const [breakOutTime, setBreakOutTime] = React.useState(null);

  // Reiniciar timer
  const restartTimer = () => {
    const key = uuid.v4().slice(0, 13);
    setTimerKey(key);
    setTimerOn(false);
    setTimerStart(false);
    //setCategory('');
    setInputMin(0);
    setInputSec(0);
    setTimerInput(0);
  };

  // Set time
  const setTimer = () => {
    const totalTime = parseInt(inputMin, 10) * 60 + parseInt(inputSec, 10);
    setTimerInput(totalTime);
    setTimerOn(true);
    setTimerStart(true);
  };

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
          <Center mt="6">
            <HStack>
              <Button
                onPress={() => {
                  navigation.navigate('Estadisticas');
                }}
                bg="rgba(71, 91, 216, 1)"
                rightIcon={
                  <MaterialIcon
                    name="show-chart"
                    size={16}
                    color="rgba(255, 255, 255, 1.0)"
                  />
                }>
                Estadísticas
              </Button>
              <Button
                onPress={() => {
                  navigation.navigate('Rewards');
                }}
                bg="rgba(71, 91, 216, 1)"
                rightIcon={
                  <MaterialIcon
                    name="show-chart"
                    size={16}
                    color="rgba(255, 255, 255, 1.0)"
                  />
                }>
                Rewards
              </Button>
            </HStack>
            <Text fontSize={20} fontWeight="bold">
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
                  //uploadStats();
                  restartTimer();
                  setFocusFinishedModalVisibility(true);
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
                  // return <Input />;
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
                // onPress={() => {
                //   // setTimerOn(false);
                //   setStopModalVisibility(true);
                // }}
                >
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
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};
export default Enfoque;
