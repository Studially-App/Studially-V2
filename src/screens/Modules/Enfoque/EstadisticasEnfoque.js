import * as React from 'react';
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

// Firestore
import {VictoryPie} from 'victory-native';
// DayJs
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const EstadisticasEnfoque = () => {
  // Toas

  // tab de tiempo
  const [tab, setTab] = React.useState('Semana');
  // Estadisticas segun categoria
  // Estadisticas academico
  const [academicoSemanalStats, setAcademicoSemanalStats] = React.useState(0);
  const [academicoMensualStats, setAcademicoMensualStats] = React.useState(0);

  // Estadisticas aprendizaje
  const [aprendizajeSemanalStats, setAprendizajeSemanalStats] =
    React.useState(0);
  const [aprendizajeMensualStats, setAprendizajeMensualStats] =
    React.useState(0);

  // Estadisticas Proyecto
  const [proyectoSemanalStats, setProyectoSemanalStats] = React.useState(0);
  const [proyectoMensualStats, setProyectoMensualStats] = React.useState(0);

  // Estadisticas academico
  const [trabajoSemanalStats, setTrabajoSemanalStats] = React.useState(0);
  const [trabajoMensualStats, setTrabajoMensualStats] = React.useState(0);

  // Estadisticas academico
  const [personalSemanalStats, setPersonalSemanalStats] = React.useState(0);
  const [personalMensualStats, setPersonalMensualStats] = React.useState(0);

  const format = (num, decimals) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 5,
    });

  return (
    <NativeBaseProvider>
      <VStack mt="8" alignItems="center">
        <ScrollView w="100%" h="85%">
          <VStack alignItems="center">
            <HStack space="2" justifyContent="center">
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
            <>
              <VictoryPie
                data={[
                  {x: 'Académico', y: 25},
                  {x: 'Aprendizaje', y: 10},
                  {x: 'Proyecto', y: 20},
                  {x: 'Trabajo', y: 35},
                  {x: 'Personal', y: 20},
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
                    fontSize: 20,
                    fontWeight: 'bold',
                  },
                }}
                padding={{bottom: 0, top: 36, left: 36, right: 36}}
                labels={({datum}) => `${datum.y}%`}
              />
            </>
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
                      ? `${format(academicoSemanalStats / 3600)} horas`
                      : tab === 'Mes'
                      ? `${format(academicoMensualStats / 3600)} horas`
                      : null}
                  </Text>
                  <Text fontSize="18" ml="3">
                    -
                  </Text>
                  <Text fontSize="18" ml="3">
                    00%
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
                      ? `${format(aprendizajeSemanalStats / 3600)} horas`
                      : tab === 'Mes'
                      ? `${aprendizajeMensualStats / 3600} horas`
                      : null}
                  </Text>
                  <Text fontSize="18" ml="3">
                    -
                  </Text>
                  <Text fontSize="18" ml="3">
                    00%
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
                      ? `${format(proyectoSemanalStats / 3600)} horas`
                      : tab === 'Mes'
                      ? `${format(proyectoMensualStats / 3600)} horas`
                      : null}
                  </Text>
                  <Text fontSize="18" ml="3">
                    -
                  </Text>
                  <Text fontSize="18" ml="3">
                    00%
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
                      ? `${format(trabajoSemanalStats / 3600)} horas`
                      : tab === 'Mes'
                      ? `${format(trabajoMensualStats / 3600)} horas`
                      : null}
                  </Text>
                  <Text fontSize="18" ml="3">
                    -
                  </Text>
                  <Text fontSize="18" ml="3">
                    00%
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
                      ? `${format(personalSemanalStats / 3600)} hora/s`
                      : tab === 'Mes'
                      ? `${format(personalMensualStats / 3600)} hora/s`
                      : null}
                  </Text>
                  <Text fontSize="18" ml="3">
                    -
                  </Text>
                  <Text fontSize="18" ml="3">
                    00%
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
