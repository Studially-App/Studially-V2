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
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalDetalleHabito from '../../../components/Habitos/ModalDetalleHabito';
import {useUser} from '../../../context/User';

const AgregarHabitos = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userTier} = useUser();

  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);

  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [data, setData] = React.useState([]);

  const [spinnerModal, setSpinnerModal] = useState(true);

  const [habitCount, setHabitCount] = useState(0);

  // Set an initializing state whilst Firebase connects
  const {userInfo, user} = useUser();

  const getHabitsStats = async () => {
    const habitsStats = await firestore()
      .collection('habitos')
      .doc('Personas')
      .get();
    return habitsStats._data.habitos;
  };

  const updateHabitsStats = async () => {
    const getPreviewHabits = await firestore()
      .collection('usuarios')
      .doc(user.uid)
      .get();
    const previewHabits = getPreviewHabits._data.habitos;

    let habitsStats = await getHabitsStats();

    const previewNames = [];
    previewHabits.map(habit => {
      if (habit.selected) {
        previewNames.push(habit.name);
      }
    });
    const actualNames = [];
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
        const index = habitsStats.findIndex(stat => {
          return stat.name === habito;
        });
        habitsStats[index].persons = habitsStats[index].persons - 1;
      });
    }

    if (sumaPersonas.length > 0) {
      sumaPersonas.map(habito => {
        const index = habitsStats.findIndex(stat => {
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

  const getHabits = async userInfo => {
    if (Object.keys(userInfo.habitos).length !== 0) {
      const userHabits = userInfo.habitos;
      setData(userHabits);
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

  const updateHabits = () => {
    try {
      updateHabitsStats();
      firestore()
        .collection('usuarios')
        .doc(user.uid)
        .update({
          habitos: data,
        })
        .then(() => {
          console.log('User habits updated!');
          navigation.goBack();
          route.params.onGoBack();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const changeSelected = index => {
    let changeData = [...data];
    let count = habitCount;
    if (changeData[index].selected) {
      changeData[index].frecuencia = [0, 0, 0, 0, 0, 0, 0];
      changeData[index].marcadoSemana = [];
    }
    changeData[index].selected = !changeData[index].selected;
    count = count + 1;
    setHabitCount(count);
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
      <VStack alignItems="center" mt={3} mb={20}>
        <ScrollView w="100%" h="200px">
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
                {habitCount >= 2 && !item.selected ? (
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
                        setDataDetalle(item);
                        setDetalleModalVisibility(true);
                        changeSelected(i);
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
