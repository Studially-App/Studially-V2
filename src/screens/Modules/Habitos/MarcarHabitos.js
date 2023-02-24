import React from 'react';

import {ScrollView, useWindowDimensions} from 'react-native';

import {
  Text,
  HStack,
  NativeBaseProvider,
  VStack,
  Button,
  Pressable,
  View,
  Spacer,
  Box,
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const MarcarHabitos = () => {
  //Dimensión de pantalla
  const {width, height} = useWindowDimensions();

  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);

  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [data, setData] = React.useState([
    {
      name: 'Actividad Física',
      icono: 'sports-handball',
      marked: false,
      completed: false,
    },
    {
      name: 'Alimentación sana',
      icono: 'restaurant',
      marked: false,
      completed: false,
    },
    {
      name: 'Aprendizaje continuo',
      icono: 'psychology',
      marked: false,
      completed: false,
    },
    {
      name: 'Arte y creatividad',
      icono: 'celebration',
      marked: false,
      completed: false,
    },
    {
      name: 'Autocuidado',
      icono: 'accessibility',
      marked: false,
      completed: false,
    },
    {
      name: 'Conexión social',
      icono: 'connect-without-contact',
      marked: false,
      completed: false,
    },
    {
      name: 'Descanso',
      icono: 'nightlight-round',
      marked: false,
      completed: false,
    },
    {
      name: 'Desconexión',
      icono: 'mobile-off',
      marked: false,
      completed: false,
    },
    {
      name: 'Lectura',
      icono: 'chrome-reader-mode',
      marked: false,
      completed: false,
    },
    {
      name: 'Limpieza',
      icono: 'dry-cleaning',
      marked: false,
      completed: false,
    },
    {
      name: 'Meditar',
      icono: 'self-improvement',
      marked: false,
      completed: false,
    },
    {
      name: 'Organización',
      icono: 'event-note',
      marked: false,
      completed: false,
    },
    {
      name: 'Practicar idioma',
      icono: 'translate',
      marked: false,
      completed: false,
    },
  ]);

  const marcarHabito = (i, accion) => {
    let marcado = [...data];
    if (accion === 'Completado') {
      marcado[i].completed = true;
      marcado[i].marked = true;
    } else {
      marcado[i].marked = true;
    }
    setData(marcado);
  };

  const desmarcarHabito = i => {
    let desmarcado = [...data];
    desmarcado[i].completed = false;
    desmarcado[i].marked = false;
    setData(desmarcado);
  };

  return (
    <NativeBaseProvider>
      <VStack alignItems="center" mt={3} mb={20}>
        <ScrollView w="100%" h="200px">
          <VStack space={15} alignItems="center">
            <HStack space={4} justifyContent="center">
              <Button onPress={() => console.log('Mis hábitos')} bg="white">
                <Text fontSize="xl" color="#475BD8">
                  Mis hábitos
                </Text>
              </Button>
              <Button
                onPress={() => console.log('habitos del día')}
                bg="#475BD8">
                <Text fontSize="xl" color="white">
                  Hábitos del día
                </Text>
              </Button>
            </HStack>
            {data.map((item, i) =>
              item.marked === true ? (
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
                      <Text fontSize="2xl" color="#061678" textAlign="center">
                        Completado
                      </Text>
                    ) : (
                      <Text fontSize="2xl" color="#061678" textAlign="center">
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
                        Deshacer <Icon size={20} color="white" name="undo" />
                      </Text>
                    </Button>
                  </HStack>
                </Box>
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
                        marcarHabito(i, 'No Completado');
                      }}
                    />
                    <Icon
                      size={35}
                      color="#23C820"
                      name="check-circle"
                      onPress={() => {
                        marcarHabito(i, 'Completado');
                      }}
                    />
                  </HStack>
                </Box>
              ),
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};
export default MarcarHabitos;
