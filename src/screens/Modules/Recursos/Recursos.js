import * as React from 'react';
// Native Base
import {
  Box,
  Pressable,
  NativeBaseProvider,
  VStack,
  HStack,
  Text,
  Center,
  Spacer,
} from 'native-base';
// Icons
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

const Recursos = () => {
  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <Center h="90%">
        <VStack
          w="330px"
          h="300px"
          justifyContent="center"
          alignContent="center"
          alignItems="center">
          <HStack justifyContent="center">
            <Pressable onPress={() => navigation.navigate('Comercios')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <Icon name="store" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Comercios
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
            <Spacer />
            <Pressable onPress={() => navigation.navigate('Cursos')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <IconMCI
                        name="book-play-outline"
                        color="#475BD8"
                        size={60}
                      />
                      <Text fontSize="lg" bold>
                        Cursos
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
          </HStack>
          <Spacer />
          <HStack justifyContent="center">
            <Pressable onPress={() => navigation.navigate('Eventos')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <IconMCI name="calendar-edit" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Eventos
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
            <Spacer />
            <Pressable onPress={() => navigation.navigate('Otros')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <Icon name="pending" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Otros
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
          </HStack>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
};

export default Recursos;
