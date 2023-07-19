import * as React from 'react';
import {
  NativeBaseProvider,
  VStack,
  Text,
  Stack,
  Center,
  Heading,
  Button,
  Flex,
  ScrollView,
} from 'native-base';
// Material-UI Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunitiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = ({ navigation }) => (
  <NativeBaseProvider>

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView h="100%" bg="#FAFAFA">
        <VStack space={2} justifyContent="center" mt={4} bg="#FAFAFA">
          <Flex direction="column" align="center">
            <Stack direction="column" space={2}>
              <Stack space={4} direction="row" alignItems="center" bg="#FAFAFA">
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  bg="#FFFFFF"
                  shadow="5"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialIcon name="access-time" color="#3B1DF9" size={54} />
                    <Text fontSize={'sm'}>Organización</Text>
                  </VStack>
                </Center>
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  shadow="5"
                  bg="#FFFFFF"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialCommunitiIcon
                      name="meditation"
                      color="#3B1DF9"
                      size={54}
                    />
                    <Text fontSize={'sm'}>Hábitos</Text>
                  </VStack>
                </Center>
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  shadow="5"
                  bg="#FFFFFF"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialCommunitiIcon
                      name="piggy-bank-outline"
                      color="#3B1DF9"
                      size={54}
                    />
                    <Text fontSize={'sm'}>Finanzas</Text>
                  </VStack>
                </Center>
              </Stack>
              <Stack space={4} direction="row" alignItems="center" bg="#FAFAFA">
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  bg="#FFFFFF"
                  shadow="5"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialCommunitiIcon
                      name="book-open-blank-variant"
                      color="#3B1DF9"
                      size={54}
                    />
                    <Text fontSize={'sm'}>Aprendizaje</Text>
                  </VStack>
                </Center>
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  shadow="5"
                  bg="#FFFFFF"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialIcon name="auto-awesome" color="#3B1DF9" size={54} />
                    <Text fontSize={'sm'}>Beneficios y oportunidades</Text>
                  </VStack>
                </Center>
                <Center
                  width={[24, 48, 72]}
                  height="32"
                  shadow="5"
                  bg="#FFFFFF"
                  rounded="4">
                  <VStack space={1} alignItems="center">
                    <MaterialIcon name="people" color="#3B1DF9" size={54} />
                    <Text fontSize={'sm'}>Comunidad</Text>
                  </VStack>
                </Center>
              </Stack>
            </Stack>
          </Flex>
          <Flex direction="column" align="center" mt={6}>
            <Heading size="3xl" color="#272C46">
              ¡Bienvenido!
            </Heading>
            <Text color="#272C46" fontSize="2xl">
              Te hemos echado de menos
            </Text>
            <Stack direction="column" space={3} mt={6} w="90%">
              <Button
                h={12}
                // color="#FFFFF"
                bg="#475BD8"
                _pressed={{
                  backgroundColor: '#04178a',
                }}
                borderRadius={4}
                _text={{
                  fontSize: 'xl',
                }}
                onPress={() => navigation.navigate('SignIn')}>
                Iniciar sesión
              </Button>
              <Button
                h={12}
                bg="#FFF"
                // color="#475BD8"
                borderWidth="2"
                borderColor="#475BD8"
                _pressed={{ bg: '#FFF' }}
                _text={{
                  color: '#475BD8',
                  fontSize: 'xl',
                }}
                onPress={() => navigation.navigate('SignUp')}
                borderRadius={4}>
                Registrarse
              </Button>
            </Stack>
          </Flex>
        </VStack>
      </ScrollView>

    </SafeAreaView>
  </NativeBaseProvider>
);

export default Welcome;
