import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  ScrollView,
  VStack,
  Flex,
  HStack,
  Text,
  Button,
  NativeBaseProvider,
  Square,
} from 'native-base';

import {useRoute} from '@react-navigation/native';

// stats Graph
import {VictoryPie} from 'victory-native';
// DayJs
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const EstadisticasEnfoque = () => {
  // route params
  const route = useRoute();

  // tab de tiempo
  const [tab, setTab] = useState('Semana');
  // Estadisticas segun categoria
  // Estadisticas academico
  const [academicoSemanalStats, setAcademicoSemanalStats] = useState(0);
  const [academicoMensualStats, setAcademicoMensualStats] = useState(0);

  // Estadisticas aprendizaje
  const [aprendizajeSemanalStats, setAprendizajeSemanalStats] = useState(0);
  const [aprendizajeMensualStats, setAprendizajeMensualStats] = useState(0);

  // Estadisticas Proyecto
  const [proyectoSemanalStats, setProyectoSemanalStats] = useState(0);
  const [proyectoMensualStats, setProyectoMensualStats] = useState(0);

  // Estadisticas academico
  const [trabajoSemanalStats, setTrabajoSemanalStats] = useState(0);
  const [trabajoMensualStats, setTrabajoMensualStats] = useState(0);

  // Estadisticas academico
  const [personalSemanalStats, setPersonalSemanalStats] = useState(0);
  const [personalMensualStats, setPersonalMensualStats] = useState(0);

  const [minTotalesSemana, setMinTotalesSemana] = useState(0);
  const [minTotalesMes, setMinTotalesMes] = useState(0);

  const setMinutes = () => {
    const stats = route.params.minutes;
    let minTotalSem = 0;
    let minTotalMes = 0;
    stats.map(stat => {
      minTotalSem = minTotalSem + stat.minutosSemana;
      minTotalMes = minTotalMes + stat.minutos;
      if (stat.categoria === 'Académico') {
        setAcademicoMensualStats(stat.minutos);
        setAcademicoSemanalStats(stat.minutosSemana);
      }
      if (stat.categoria === 'Aprendizaje') {
        setAprendizajeMensualStats(stat.minutos);
        setAprendizajeSemanalStats(stat.minutosSemana);
      }
      if (stat.categoria === 'Proyectos') {
        setProyectoMensualStats(stat.minutos);
        setProyectoSemanalStats(stat.minutosSemana);
      }
      if (stat.categoria === 'Trabajo') {
        setTrabajoMensualStats(stat.minutos);
        setTrabajoSemanalStats(stat.minutosSemana);
      }
      if (stat.categoria === 'Personal') {
        setPersonalMensualStats(stat.minutos);
        setPersonalSemanalStats(stat.minutosSemana);
      }
    });
    setMinTotalesSemana(minTotalSem);
    setMinTotalesMes(minTotalMes);
  };

  useEffect(() => {
    setMinutes();
  });

  return (
    <NativeBaseProvider>
      <VStack mt="8" alignItems="center">
        <ScrollView w="100%" h="85%">
          <VStack alignItems="center">
            <HStack space="2" justifyContent="center" mb={2}>
              <Button
                w="24"
                onPress={() => {
                  if (tab !== 'Semana') {
                    setTab('Semana');
                    // weekStatsFilter();
                  }
                }}
                bg={tab === 'Semana' ? '#475BD8' : '#EEEEEE'}
                _pressed={{
                  backgroundColor: '#475BD8',
                  _text: {
                    color: '#FFFFFF',
                  },
                }}
                _text={
                  tab === 'Semana'
                    ? {
                        fontSize: '18',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                      }
                    : {
                        fontSize: '18',
                        color: '#475BD8',
                        fontWeight: 'bold',
                      }
                }>
                Semana
              </Button>
              <Button
                w="24"
                onPress={() => {
                  setTab('Mes');
                }}
                bg={tab === 'Mes' ? '#475BD8' : '#EEEEEE'}
                _pressed={{
                  backgroundColor: '#475BD8',
                  _text: {
                    color: '#FFFFFF',
                  },
                }}
                _text={
                  tab === 'Mes'
                    ? {
                        fontSize: '18',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                      }
                    : {
                        fontSize: '18',
                        color: '#475BD8',
                        fontWeight: 'bold',
                      }
                }>
                Mes
              </Button>
            </HStack>
            {tab === 'Semana' ? (
              <Text fontSize={15}>
                Esta semana te enfocaste{' '}
                <Text fontSize={15} fontWeight="bold">
                  {minTotalesSemana}
                </Text>{' '}
                minutos
              </Text>
            ) : (
              <Text fontSize={15}>
                Este mes hiciste{' '}
                <Text fontSize={15} fontWeight="bold">
                  {minTotalesMes}
                </Text>{' '}
                minutos
              </Text>
            )}
            {tab === 'Semana' && minTotalesSemana > 0 ? (
              <>
                <VictoryPie
                  data={[
                    {
                      x: 'Académico',
                      y: parseFloat(
                        (
                          (academicoSemanalStats * 100) /
                          minTotalesSemana
                        ).toFixed(1),
                      ),
                    },
                    {
                      x: 'Aprendizaje',
                      y: parseFloat(
                        (
                          (aprendizajeSemanalStats * 100) /
                          minTotalesSemana
                        ).toFixed(1),
                      ),
                    },
                    {
                      x: 'Proyecto',
                      y: parseFloat(
                        (
                          (proyectoSemanalStats * 100) /
                          minTotalesSemana
                        ).toFixed(1),
                      ),
                    },
                    {
                      x: 'Trabajo',
                      y: parseFloat(
                        (
                          (trabajoSemanalStats * 100) /
                          minTotalesSemana
                        ).toFixed(1),
                      ),
                    },
                    {
                      x: 'Personal',
                      y: parseFloat(
                        (
                          (personalSemanalStats * 100) /
                          minTotalesSemana
                        ).toFixed(1),
                      ),
                    },
                  ]}
                  colorScale={[
                    '#7381FF',
                    '#FE718C',
                    '#FEB543',
                    '#018254',
                    '#30357C',
                  ]}
                  labelRadius={({innerRadius}) => innerRadius + 20}
                  innerRadius={56}
                  width={328}
                  origin={{y: 148}}
                  height={300}
                  style={{
                    labels: {
                      fill: 'white',
                      fontSize: 17,
                      fontWeight: 'bold',
                    },
                  }}
                  padding={{bottom: 0, top: 36, left: 36, right: 36}}
                  labels={({datum}) => (datum.y === 0 ? '' : `${datum.y}%`)}
                />
              </>
            ) : tab === 'Mes' && minTotalesMes > 0 ? (
              <>
                <VictoryPie
                  data={[
                    {
                      x: 'Académico',
                      y: parseFloat(
                        ((academicoMensualStats * 100) / minTotalesMes).toFixed(
                          1,
                        ),
                      ),
                    },
                    {
                      x: 'Aprendizaje',
                      y: parseFloat(
                        (
                          (aprendizajeMensualStats * 100) /
                          minTotalesMes
                        ).toFixed(1),
                      ),
                    },
                    {
                      x: 'Proyecto',
                      y: parseFloat(
                        ((proyectoMensualStats * 100) / minTotalesMes).toFixed(
                          1,
                        ),
                      ),
                    },
                    {
                      x: 'Trabajo',
                      y: parseFloat(
                        ((trabajoMensualStats * 100) / minTotalesMes).toFixed(
                          1,
                        ),
                      ),
                    },
                    {
                      x: 'Personal',
                      y: parseFloat(
                        ((personalMensualStats * 100) / minTotalesMes).toFixed(
                          1,
                        ),
                      ),
                    },
                  ]}
                  colorScale={[
                    '#7381FF',
                    '#FE718C',
                    '#FEB543',
                    '#018254',
                    '#30357C',
                  ]}
                  labelRadius={({innerRadius}) => innerRadius + 20}
                  innerRadius={56}
                  width={328}
                  origin={{y: 148}}
                  height={300}
                  style={{
                    labels: {
                      fill: 'white',
                      fontSize: 17,
                      fontWeight: 'bold',
                    },
                  }}
                  padding={{bottom: 0, top: 36, left: 36, right: 36}}
                  labels={({datum}) => (datum.y === 0 ? '' : `${datum.y}%`)}
                />
              </>
            ) : null}

            <VStack w="100%" alignItems="center" space="2">
              <HStack
                w="100%"
                justifyContent="center"
                space="4"
                alignItems="center">
                <Flex direction="row" w="36%" alignItems="center">
                  <Square size="16px" bg="#7381FF" />
                  <Text ml="3" fontSize="18">
                    Académico
                  </Text>
                </Flex>
                <Flex direction="row" alignItems="center">
                  <Text fontSize="18">
                    {tab === 'Semana'
                      ? `${academicoSemanalStats} minutos`
                      : tab === 'Mes'
                      ? `${academicoMensualStats} minutos`
                      : null}
                  </Text>
                </Flex>
              </HStack>
              <HStack
                w="100%"
                justifyContent="center"
                space="4"
                alignItems="center">
                <Flex direction="row" w="36%" alignItems="center">
                  <Square size="16px" bg="#FE718C" />
                  <Text ml="3" fontSize="18">
                    Aprendizaje
                  </Text>
                </Flex>
                <Flex direction="row" alignItems="center">
                  <Text fontSize="18">
                    {tab === 'Semana'
                      ? `${aprendizajeSemanalStats} minutos`
                      : tab === 'Mes'
                      ? `${aprendizajeMensualStats} minutos`
                      : null}
                  </Text>
                </Flex>
              </HStack>
              <HStack
                w="100%"
                justifyContent="center"
                space="4"
                alignItems="center">
                <Flex direction="row" w="36%" alignItems="center">
                  <Square size="16px" bg="#FEB543" />
                  <Text ml="3" fontSize="18">
                    Proyecto
                  </Text>
                </Flex>
                <Flex direction="row" alignItems="center">
                  <Text fontSize="18">
                    {tab === 'Semana'
                      ? `${proyectoSemanalStats} minutos`
                      : tab === 'Mes'
                      ? `${proyectoMensualStats} minutos`
                      : null}
                  </Text>
                </Flex>
              </HStack>
              <HStack
                w="100%"
                justifyContent="center"
                space="4"
                alignItems="center">
                <Flex direction="row" w="36%" alignItems="center">
                  <Square size="16px" bg="#018254" />
                  <Text ml="3" fontSize="18">
                    Trabajo
                  </Text>
                </Flex>
                <Flex direction="row" alignItems="center">
                  <Text fontSize="18">
                    {tab === 'Semana'
                      ? `${trabajoSemanalStats} minutos`
                      : tab === 'Mes'
                      ? `${trabajoMensualStats} minutos`
                      : null}
                  </Text>
                </Flex>
              </HStack>
              <HStack
                w="100%"
                justifyContent="center"
                space="4"
                alignItems="center">
                <Flex direction="row" w="36%" alignItems="center">
                  <Square size="16px" bg="#30357C" />
                  <Text ml="3" fontSize="18">
                    Personal
                  </Text>
                </Flex>
                <Flex direction="row" alignItems="center">
                  <Text fontSize="18">
                    {tab === 'Semana'
                      ? `${personalSemanalStats} minutos`
                      : tab === 'Mes'
                      ? `${personalMensualStats} minutos`
                      : null}
                  </Text>
                </Flex>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};

export default EstadisticasEnfoque;
