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
  Box,
  Spacer,
  Modal,
  Spinner,
  Heading,
} from 'native-base';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import ModalDetalleHabito from '../../../components/Habitos/ModalDetalleHabito';

const AgregarHabitos = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Estado modal detalle
  const [detalleModalVisibility, setDetalleModalVisibility] =
    React.useState(false);

  // Data detalle
  const [dataDetalle, setDataDetalle] = React.useState({});

  const [previewsHabits, setPreviewsHabits] = React.useState([
    {
      name: 'Actividad Física',
      icono: 'sports-handball',
      texto:
        'Mover tu cuerpo es una de las formas más efectivas de llenarte de energía, mantenerte fuerte, dormir mejor y reducir la depresión y ansiedad. \n¡Actívate!\nEjemplos: practicar algún deporte, ir al gym, salir a caminar, bailar, andar en bici, saltar la cuerda, patinar, etc.',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Alimentación sana',
      icono: 'restaurant',
      texto:
        'Una alimentación variada y balanceada te ayudará a sentirte mejor y con más energía para enfrentar con éxito cada reto en tu día.\nPlanea tus comidas para que diario consumas proteínas, carbohidratos y grasas, además de frutas y verduras.\n¡Recuerda que el balance es la clave! ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Aprendizaje continuo',
      icono: 'psychology',
      texto:
        'El aprendizaje va mucho más allá de la escuela.\n Seguir aprendiendo de temas de tu interés te hará estar informado y preparado sobre el mundo a tu alrededor, tomar mejores decisiones, crecer a nivel profesional y personal y desarrollar nuevas habilidades.\n¡Nunca dejes de aprender!\n\nTips: busca y filtra información sobre temas de tu interés, destina un tiempo específico en tu día para aprender de ese tema, de ser posible pon en práctica lo que vayas aprendiendo y comparte lo que sabes.',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Arte y creatividad',
      icono: 'celebration',
      texto:
        'El arte y la creatividad te permiten visualizar las cosas desde otras perspectivas, desarrollando tu capacidad de imaginar, crear e inventar propuestas de valor únicas y diferentes.\nAlgunos beneficios son: mejora la atención y concentración, ayuda a combatir el estrés, desarrolla tus sentidos, etc.\nEjemplos: tocar un instrumento, cantar, pintar, componer, dibujar, fotografiar, hacer manualidades, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Autocuidado',
      icono: 'accessibility',
      texto:
        'Cuidar de ti mismo es prioridad.\nRealiza actividades que te permitan estar atento a lo que te sucede, a lo que piensas y sientes para lograr tu bienestar físico y psicológico.\nEjemplos: practicar yoga, llevar un diario, pasar tiempo a solas contigo haciendo algo que te guste, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Conexión social',
      icono: 'connect-without-contact',
      texto:
        'Destina un tiempo para conectar con las personas a tu alrededor, ya sea amigos, familia o pareja.\nLlámalos o, mejor aún, pasa tiempo de calidad con ellos. Únete a un grupo o club de tu interés, sé voluntario en algún proyecto social o simplemente disfruta de una comida con tus seres queridos.\nEsto te ayudará a no sentirte solo, a reducir la ansiedad, depresión y a sentirte en general más feliz.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Descanso',
      icono: 'nightlight-round',
      texto:
        'El descanso permite que tu cuerpo se recupere, previene el burnout y hace que pienses con mayor claridad.\n¡El descanso también es productivo!\nTips: fija tiempos de descanso, ten una rutina y no veas pantallas antes de dormir, trata de dormir entre 7-8 horas y no satures tus días por completo.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Desconexión',
      icono: 'mobile-off',
      texto:
        'Pasar demasiado tiempo enganchados a lo digital puede afectar a nuestra capacidad para prestar atención, a nuestra privacidad, a nuestros niveles de estrés y productividad. Por eso es muy importante poner límites y practicar la desconexión digital.\nTips: pon un límite de tiempo a las redes sociales, elige un día en el que utilices al mínimo tu celular, ten un día sin videollamadas ni pantallas y en su lugar opta por actividades al aire libre, juegos de mesa, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Lectura',
      icono: 'chrome-reader-mode',
      texto:
        'Leer te permite mejorar tu creatividad, entretenerte, crecer, y en muchos casos, encontrarte. Además, te ayuda a practicar la concentración y te brinda herramientas que puedes usar luego en el mundo real.\n"Si te sobran ideas, escribe, si te faltan, lee. "\nTip: destina 15min de tu día a leer. ¡Disfrútalo!  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Limpieza',
      icono: 'dry-cleaning',
      texto:
        'Pequeños detalles marcan la diferencia.\nDestina un día o unas horas de tu semana a limpiar tus espacios. Ejemplos: lavar tu ropa y/o tenis, barrer, limpiar superficies, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Meditar',
      icono: 'self-improvement',
      texto:
        'La meditación es un entrenamiento de la mente que sirve para aprender a ser más consciente de las sensaciones y emociones que sentimos.\nA meditar logras una mayor concentración, claridad, positividad emocional y calma interior.\nTip: ten paciencia al comenzar. Aunque no lo creas, 5min pueden ser suficientes.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Organización',
      icono: 'event-note',
      texto:
        'La organización es clave para la disciplina. Al organizarte tienes más claridad, más motivación y te permite trazar un camino claro hacia tus objetivos.\nTip: destina unos minutos a planear tu semana y tus días, así como tus tareas pendientes.\nUna vez hecho esto, ¡podrás disfrutar de más tiempo libre! ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Practicar idioma',
      icono: 'translate',
      texto:
        'Practicar un idioma entrena tu cerebro y te abre la posibilidad de conocer amigos de otras partes del mundo, ya sea en línea o estudiando/trabajando en el extranjero. Además, puede aumentar tu confianza, tus conocimientos sobre otra cultura y darle un impulso a tu carrera profesional.\n¿Cuál practicarás hoy? ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
  ]);

  const [data, setData] = React.useState([
    {
      name: 'Actividad Física',
      icono: 'sports-handball',
      texto:
        'Mover tu cuerpo es una de las formas más efectivas de llenarte de energía, mantenerte fuerte, dormir mejor y reducir la depresión y ansiedad. \n¡Actívate!\nEjemplos: practicar algún deporte, ir al gym, salir a caminar, bailar, andar en bici, saltar la cuerda, patinar, etc.',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Alimentación sana',
      icono: 'restaurant',
      texto:
        'Una alimentación variada y balanceada te ayudará a sentirte mejor y con más energía para enfrentar con éxito cada reto en tu día.\nPlanea tus comidas para que diario consumas proteínas, carbohidratos y grasas, además de frutas y verduras.\n¡Recuerda que el balance es la clave! ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Aprendizaje continuo',
      icono: 'psychology',
      texto:
        'El aprendizaje va mucho más allá de la escuela.\n Seguir aprendiendo de temas de tu interés te hará estar informado y preparado sobre el mundo a tu alrededor, tomar mejores decisiones, crecer a nivel profesional y personal y desarrollar nuevas habilidades.\n¡Nunca dejes de aprender!\n\nTips: busca y filtra información sobre temas de tu interés, destina un tiempo específico en tu día para aprender de ese tema, de ser posible pon en práctica lo que vayas aprendiendo y comparte lo que sabes.',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Arte y creatividad',
      icono: 'celebration',
      texto:
        'El arte y la creatividad te permiten visualizar las cosas desde otras perspectivas, desarrollando tu capacidad de imaginar, crear e inventar propuestas de valor únicas y diferentes.\nAlgunos beneficios son: mejora la atención y concentración, ayuda a combatir el estrés, desarrolla tus sentidos, etc.\nEjemplos: tocar un instrumento, cantar, pintar, componer, dibujar, fotografiar, hacer manualidades, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Autocuidado',
      icono: 'accessibility',
      texto:
        'Cuidar de ti mismo es prioridad.\nRealiza actividades que te permitan estar atento a lo que te sucede, a lo que piensas y sientes para lograr tu bienestar físico y psicológico.\nEjemplos: practicar yoga, llevar un diario, pasar tiempo a solas contigo haciendo algo que te guste, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Conexión social',
      icono: 'connect-without-contact',
      texto:
        'Destina un tiempo para conectar con las personas a tu alrededor, ya sea amigos, familia o pareja.\nLlámalos o, mejor aún, pasa tiempo de calidad con ellos. Únete a un grupo o club de tu interés, sé voluntario en algún proyecto social o simplemente disfruta de una comida con tus seres queridos.\nEsto te ayudará a no sentirte solo, a reducir la ansiedad, depresión y a sentirte en general más feliz.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Descanso',
      icono: 'nightlight-round',
      texto:
        'El descanso permite que tu cuerpo se recupere, previene el burnout y hace que pienses con mayor claridad.\n¡El descanso también es productivo!\nTips: fija tiempos de descanso, ten una rutina y no veas pantallas antes de dormir, trata de dormir entre 7-8 horas y no satures tus días por completo.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Desconexión',
      icono: 'mobile-off',
      texto:
        'Pasar demasiado tiempo enganchados a lo digital puede afectar a nuestra capacidad para prestar atención, a nuestra privacidad, a nuestros niveles de estrés y productividad. Por eso es muy importante poner límites y practicar la desconexión digital.\nTips: pon un límite de tiempo a las redes sociales, elige un día en el que utilices al mínimo tu celular, ten un día sin videollamadas ni pantallas y en su lugar opta por actividades al aire libre, juegos de mesa, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Lectura',
      icono: 'chrome-reader-mode',
      texto:
        'Leer te permite mejorar tu creatividad, entretenerte, crecer, y en muchos casos, encontrarte. Además, te ayuda a practicar la concentración y te brinda herramientas que puedes usar luego en el mundo real.\n"Si te sobran ideas, escribe, si te faltan, lee. "\nTip: destina 15min de tu día a leer. ¡Disfrútalo!  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Limpieza',
      icono: 'dry-cleaning',
      texto:
        'Pequeños detalles marcan la diferencia.\nDestina un día o unas horas de tu semana a limpiar tus espacios. Ejemplos: lavar tu ropa y/o tenis, barrer, limpiar superficies, etc.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Meditar',
      icono: 'self-improvement',
      texto:
        'La meditación es un entrenamiento de la mente que sirve para aprender a ser más consciente de las sensaciones y emociones que sentimos.\nA meditar logras una mayor concentración, claridad, positividad emocional y calma interior.\nTip: ten paciencia al comenzar. Aunque no lo creas, 5min pueden ser suficientes.  ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Organización',
      icono: 'event-note',
      texto:
        'La organización es clave para la disciplina. Al organizarte tienes más claridad, más motivación y te permite trazar un camino claro hacia tus objetivos.\nTip: destina unos minutos a planear tu semana y tus días, así como tus tareas pendientes.\nUna vez hecho esto, ¡podrás disfrutar de más tiempo libre! ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
    {
      name: 'Practicar idioma',
      icono: 'translate',
      texto:
        'Practicar un idioma entrena tu cerebro y te abre la posibilidad de conocer amigos de otras partes del mundo, ya sea en línea o estudiando/trabajando en el extranjero. Además, puede aumentar tu confianza, tus conocimientos sobre otra cultura y darle un impulso a tu carrera profesional.\n¿Cuál practicarás hoy? ',
      frecuencia: [0, 0, 0, 0, 0, 0, 0],
      selected: false,
      marcadoSemana: [],
      marcadoMes: [],
    },
  ]);

  const [spinnerModal, setSpinnerModal] = useState(true);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async (user, mounted) => {
    if (mounted) {
      const userInfoFB = await firestore()
        .collection('usuarios')
        .where('email', '==', user.email)
        .get();
      setUserInfo(userInfoFB._docs[0]._data);
      console.log('Set user info');
      setSpinnerModal(false);
    }
  };

  const getHabitsStats = async () => {
    const habitsStats = await firestore()
      .collection('habitos')
      .doc('Personas')
      .get();
    return habitsStats._data.habitos;
  };

  const updateHabitsStats = async () => {
    if (previewsHabits === data) {
      return;
    }
    console.log('Antes', previewsHabits);
    console.log('Ahora', data);
    let difference = data.filter(dif => !previewsHabits.includes(dif));
    console.log('Aquí está la diferencia', difference);
    let habitsStats = await getHabitsStats();
    data.map(habit => {
      if (habit.selected) {
        for (let habito of habitsStats) {
          if (habito.name === habit.name) {
            habito.persons = habito.persons + 1;
          }
        }
      }
    });
    // try {
    //   await firestore().collection('habitos').doc('Personas').update({
    //     habitos: habitsStats,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  const getHabits = (userInfo, mounted) => {
    if (mounted) {
      if (userInfo) {
        if (Object.keys(userInfo.habitos).length !== 0) {
          var userHabits = userInfo.habitos;
          setData(userHabits);
          setPreviewsHabits(userHabits);
        }
      }
    }
  };

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
      getHabits(userInfo, isMounted);
      return () => {
        isMounted = false;
      };
    }
  }, [userInfo]);

  if (initializing) {
    return null;
  }

  const updateHabits = () => {
    try {
      updateHabitsStats();
      firestore()
        .collection('usuarios')
        .doc(userInfo.userId)
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
