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
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import OctIcon from 'react-native-vector-icons/Octicons';
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
            <Pressable onPress={() => navigation.navigate('Oportunidades')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <OctIcon name="verified" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Oportunidades
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
            <Spacer />
            <Pressable onPress={() => navigation.navigate('Salud Mental')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <IconMCI
                        name="hand-heart-outline"
                        color="#475BD8"
                        size={60}
                      />
                      <Text fontSize="lg" bold>
                        Salud Mental
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
          </HStack>
          <Spacer />
          <HStack justifyContent="center">
            <Pressable onPress={() => navigation.navigate('Aprendizaje')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <OctIcon name="book" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Aprendizaje
                      </Text>
                    </Center>
                  </VStack>
                </Center>
              </Box>
            </Pressable>
            <Spacer />
            <Pressable onPress={() => navigation.navigate('Comunidad')}>
              <Box bg="white" borderRadius="lg" shadow={2} w="155px" h="140px">
                <Center>
                  <VStack justifyContent="center" alignItems="center">
                    <Center h="100%">
                      <OctIcon name="people" color="#475BD8" size={60} />
                      <Text fontSize="lg" bold>
                        Comunidad
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
