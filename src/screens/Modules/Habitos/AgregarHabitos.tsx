import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ScrollView} from 'react-native';
import {
  Text,
  HStack,
  NativeBaseProvider,
  VStack,
  Button,
  Pressable,
  Box,
  Spacer,
  Modal,
  Spinner,
  Heading,
  Badge,
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import ModalDetalleHabito from '../../../components/Habitos/ModalDetalleHabito';
import StudiallyProModal from '../../../components/StudiallyProModal';
import {useUser} from '../../../context/User';
import notifee, {
  TriggerType,
  RepeatFrequency,
  TimestampTrigger,
  AndroidNotificationSetting,
  AndroidImportance,
} from '@notifee/react-native';

type ParamList = {
  AgregarHabitos: {
    onGoBack: () => void;
  };
};

const AgregarHabitos = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AgregarHabitos'>>();
  const {userTier} = useUser();

  // Estado Pro modal
  const [proModalVisibility, setProModalVisibility] = useState(false);

  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);

  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [data, setData] = React.useState<Array<Record<string, any>>>([]);

  const [spinnerModal, setSpinnerModal] = useState(true);

  const [habitCount, setHabitCount] = useState(0);

  // Set an initializing state whilst Firebase connects
  const {userInfo, user} = useUser();

  const getHabitsStats = async () => {
    const habitsStats = await firestore()
      .collection('habitos')
      .doc('Personas')
      .get();
    return habitsStats!.data()!.habitos;
  };

  const updateHabitsStats = async () => {
    const getPreviewHabits = await firestore()
      .collection('usuarios')
      .doc(user!.uid)
      .get();
    const previewHabits = getPreviewHabits!.data()!.habitos;

    let habitsStats = await getHabitsStats();

    const previewNames: any[] = [];
    previewHabits.map((habit: {selected: any; name: any}) => {
      if (habit.selected) {
        previewNames.push(habit.name);
      }
    });
    const actualNames: any[] = [];
    data.map(habito => {
      if (habito.selected) {
        actualNames.push(habito.name);
      }
    });

    const restaPersonas = previewNames.filter(
      habit => !actualNames.includes(habit),
    );

    const sumaPersonas = actualNames.filter(
      habit => !previewNames.includes(habit),
    );

    if (restaPersonas.length > 0) {
      restaPersonas.map(habito => {
        const index = habitsStats.findIndex((stat: {name: any}) => {
          return stat.name === habito;
        });
        habitsStats[index].persons = habitsStats[index].persons - 1;
      });
    }

    if (sumaPersonas.length > 0) {
      sumaPersonas.map(habito => {
        const index = habitsStats.findIndex((stat: {name: any}) => {
          return stat.name === habito;
        });
        habitsStats[index].persons = habitsStats[index].persons + 1;
      });
    }

    try {
      await firestore().collection('habitos').doc('Personas').update({
        habitos: habitsStats,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getHabits = async (userInfo: {[x: string]: any}) => {
    if (Object.keys(userInfo.habitos).length > 0) {
      const userHabits = userInfo.habitos;
      setData(userHabits);
      let initialCount = 0;
      for (let i = 0; i < userHabits.length; i++) {
        if (userHabits[i].selected) initialCount++;
      }
      setHabitCount(initialCount);
    } else {
      const snapshot = await firestore().collection('habitosApp').get();
      const habitos = snapshot.docs.map(doc => doc.data());
      setData(habitos);
    }
    setSpinnerModal(false);
  };

  useEffect(() => {
    if (userInfo) {
      getHabits(userInfo);
    }
  }, [userInfo]);

  const createTriggerNotification = async ({
    date,
    body,
  }: {
    date: Date;
    body: string;
  }) => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
      alarmManager: true,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Recuerda marcar tus habitos',
        body,
        android: {
          channelId: 'habits',
        },
      },
      trigger,
    );
  };

  const scheduleWeeklyNotifications = async () => {
    const frequencyMap = new Map();
    const selectedHabits = data.filter(habit => habit.selected);
    selectedHabits.forEach(habit => {
      habit.frecuencia.forEach((day: number, index: number) => {
        if (day === 1) {
          if (frequencyMap.has(index)) {
            frequencyMap.set(index, [...frequencyMap.get(index), habit.name]);
          } else {
            frequencyMap.set(index, [habit.name]);
          }
        }
      });
    });

    const promises: Promise<void>[] = [];
    frequencyMap.forEach((habits: string[], day: number) => {
      const date = new Date();
      date.setHours(
        date.getHours(),
        date.getMinutes(),
        date.getSeconds() + 10,
        0,
      );
      date.setDate(date.getDate() + ((day + 8 - date.getDay()) % 7));
      const body = `Hoy es un gran dpua para realizar tus hábitos: ${habits.join(
        ', ',
      )}`;
      console.log(`scheduled notification for ${date} with body ${body}`);
      promises.push(createTriggerNotification({date, body}));
    });

    await Promise.all(promises);
  };

  const updateHabits = async () => {
    try {
      updateHabitsStats();
      await firestore().collection('usuarios').doc(user!.uid).update({
        habitos: data,
      });

      console.log('User habits updated!');
      console.log(data);
      const settings = await notifee.getNotificationSettings();
      if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
        await notifee.createChannel({
          id: 'habits',
          name: 'Recordatorio',
          lights: false,
          vibration: true,
          importance: AndroidImportance.DEFAULT,
        });
        console.log('Notifications enabled');
        const ids = await notifee.getTriggerNotificationIds();
        ids.forEach(id => {
          notifee.cancelTriggerNotification(id);
        });
        await scheduleWeeklyNotifications();
      }
      navigation.goBack();
      route.params.onGoBack();
    } catch (error) {
      console.log(error);
    }
  };

  const changeSelected = (index: number) => {
    let changeData = [...data];
    let count = habitCount;
    if (changeData[index].selected) {
      changeData[index].frecuencia = [0, 0, 0, 0, 0, 0, 0];
      changeData[index].marcadoSemana = [];
      count = count - 1;
      setHabitCount(count);
    } else {
      count = count + 1;
      setHabitCount(count);
    }
    changeData[index].selected = !changeData[index].selected;
    setData(changeData);
  };

  return (
    <NativeBaseProvider>
      <Modal isOpen={spinnerModal}>
        <Spinner color="cyan.500" size="lg" />
        <Heading color="cyan.500" fontSize="md">
          Cargando Hábitos
        </Heading>
      </Modal>
      <ModalDetalleHabito
        modalVisibility={detalleModalVisibility}
        setModalVisibility={setDetalleModalVisibility}
        data={dataDetalle}
        setData={setDataDetalle}
        updateHabits={updateHabits}
      />
      <StudiallyProModal
        proModalVisibility={proModalVisibility}
        setProModalVisibility={setProModalVisibility}
      />
      <VStack alignItems="center" mt={3} mb={20}>
        <ScrollView>
          <VStack space={15} alignItems="center">
            {data.map((item, i) => (
              <Box
                width="95%"
                height="60px"
                bg="white"
                p="4"
                shadow={2}
                alignItems="center"
                justifyContent="center"
                rounded="lg"
                key={i}>
                {habitCount >= 2 && !item.selected && userTier !== 'premium' ? (
                  <Badge
                    colorScheme="danger"
                    rounded="full"
                    mb={-5}
                    mr={0}
                    zIndex={1}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 10,
                    }}>
                    Pro
                  </Badge>
                ) : null}
                <HStack space={2} justifyContent="space-around">
                  <Icon size={30} color="#061678" name={item.icono} />
                  <Spacer />
                  <Pressable
                    onPress={() => {
                      setDataDetalle(item);
                      setDetalleModalVisibility(true);
                    }}
                    w="100%"
                    alignItems="center"
                    key={i}>
                    <Text fontSize="xl" color="#061678" textAlign="center">
                      {item.name}
                    </Text>
                  </Pressable>
                  <Spacer />
                  {item.selected ? (
                    <Icon
                      size={28}
                      color="#061678"
                      name="check-circle"
                      onPress={() => changeSelected(i)}
                    />
                  ) : (
                    <Icon
                      size={28}
                      color="#061678"
                      name="add-circle-outline"
                      onPress={() => {
                        if (userTier !== 'premium' && habitCount >= 2) {
                          setProModalVisibility(true);
                        } else {
                          setDataDetalle(item);
                          setDetalleModalVisibility(true);
                          changeSelected(i);
                        }
                      }}
                    />
                  )}
                </HStack>
              </Box>
            ))}

            <Button onPress={() => updateHabits()} bg="#475BD8">
              <Text fontSize="lg" color="white">
                Guardar cambios
              </Text>
            </Button>
          </VStack>
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};
export default AgregarHabitos;
