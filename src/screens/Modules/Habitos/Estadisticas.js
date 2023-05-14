import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import {
  Text,
  HStack,
  NativeBaseProvider,
  VStack,
  Box,
  Spacer,
  Modal,
  Spinner,
  Heading,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import {useUser} from '../../../context/User';

const Estadisticas = () => {
  const [selectedData, setSelectedData] = React.useState([]);

  const [spinnerModal, setSpinnerModal] = useState(true);

  // Set an initializing state whilst Firebase connects
  const {userInfo} = useUser();

  const getHabits = userInfo => {
    if (Object.keys(userInfo.habitos).length !== 0) {
      var userHabits = userInfo.habitos;
      var selectedHabits = [];
      userHabits.map(item =>
        item.selected ? selectedHabits.push(item) : null,
      );
      selectedHabits.map(item => {
        //dayjs().month()
        //if (dayjs().month() === 1) {
        if (dayjs().month() !== userInfo.estadisticasMesHabitos) {
          item.marcadoMes = [];
        }
        var dias = item.marcadoMes.reduce(function (a, b) {
          return a + b;
        }, 0);
        item.dias = dias;
      });
      setSelectedData(selectedHabits);
    }
    setSpinnerModal(false);
  };

  useEffect(() => {
    if (userInfo) {
      getHabits(userInfo);
    }
  }, [userInfo]);

  return (
    <NativeBaseProvider>
      <Modal isOpen={spinnerModal}>
        <Spinner color="cyan.500" size="lg" />
        <Heading color="cyan.500" fontSize="md">
          Cargando Hábitos
        </Heading>
      </Modal>
      <VStack alignItems="center" mt={3} mb={20} w="100%">
        <ScrollView w="100%" h="200px">
          <VStack>
            <Text fontSize="xl" color="#272C46" textAlign="justify" mb={3}>
              Aquí podrás ver el cumplimiento de tus hábitos programados en lo
              que va del mes
            </Text>

            <HStack space={2} alignItems="center" justifyContent="flex-start">
              <Text
                fontSize={25}
                color="#272C46"
                textAlign="left"
                justifyContent="flex-start">
                Días transcurridos
              </Text>
              <Box
                borderColor="#475BD8"
                borderWidth="2px"
                bg="white"
                w="30px"
                h="30px"
                rounded={100}
                alignItems="center">
                <Text color="#475BD8" fontSize="18px" bold>
                  {dayjs().date()}
                </Text>
              </Box>
            </HStack>

            <Text fontSize={20} color="#272C46" textAlign="right" mt={3}>
              Días realizados
            </Text>

            {selectedData.map((item, i) => (
              <Box
                width="100%"
                height="70px"
                bg="white"
                p="4"
                shadow={2}
                alignItems="center"
                justifyContent="center"
                key={i}
                borderBottomColor="#d4d4d4"
                borderBottomWidth={1}>
                <HStack space={2} justifyContent="space-around">
                  <Icon size={30} color="#061678" name={item.icono} />
                  <Text fontSize="xl" color="#061678" textAlign="center">
                    {item.name}
                  </Text>
                  <Spacer />
                  <Box
                    borderColor="#475BD8"
                    borderWidth="2px"
                    bg="#475BD8"
                    w="30px"
                    h="30px"
                    rounded={100}
                    alignItems="center">
                    <Text color="white" fontSize="18px" bold>
                      {item.dias}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};
export default Estadisticas;
