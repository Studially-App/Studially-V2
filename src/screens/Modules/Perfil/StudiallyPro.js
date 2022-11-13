import * as React from 'react';
//Native Base
import {
  NativeBaseProvider,
  Box,
  VStack,
  Text,
  View,
  Center,
  Button,
  Flex,
  Image,
  Divider,
} from 'native-base';

// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import StudiallyPROIcon from './StudiallyPRO.png';

const StudiallyPRO = () => {
  return (
    <NativeBaseProvider>
      <View h="100%">
        <Center flex={1} my="4">
          <Center w="100%">
            <Box
              w="80%"
              h="80%"
              bg="rgba(255, 255, 255, 1)"
              mb={16}
              shadow="9"
              rounded="12">
              <Center>
                <Box justifyContent="center" w="90%">
                  <Center h="16%">
                    <Image source={StudiallyPROIcon} alt="StudiallyPROIcon" />
                  </Center>
                </Box>
              </Center>
              <Center>
                <VStack>
                  <Text fontSize="40" bold>
                    10<Text fontSize="16">USD</Text> / mes
                  </Text>
                  <Flex direction="column" alignItems="flex-start" ml="2%">
                    <Text fontSize="18">Primer mes</Text>
                    <Text fontSize="18">gratis</Text>
                  </Flex>
                </VStack>
              </Center>
              <Divider my="3" />
              <Center my={2}>
                <VStack space={1}>
                  <Flex direction="row" alignItems="center">
                    <MaterialIcon
                      name="check"
                      color="rgba(39, 44, 70, 1)"
                      size={16}
                    />
                    <Text fontSize="24" color="rgba(71, 91, 216, 1)" ml="5%">
                      Espacio beneficio 1
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center">
                    <MaterialIcon
                      name="check"
                      color="rgba(39, 44, 70, 1)"
                      size={16}
                    />
                    <Text fontSize="24" color="rgba(71, 91, 216, 1)" ml="5%">
                      Espacio beneficio 2
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center">
                    <MaterialIcon
                      name="check"
                      color="rgba(39, 44, 70, 1)"
                      size={16}
                    />
                    <Text fontSize="24" color="rgba(71, 91, 216, 1)" ml="5%">
                      Espacio beneficio 3
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center">
                    <MaterialIcon
                      name="check"
                      color="rgba(39, 44, 70, 1)"
                      size={16}
                    />
                    <Text fontSize="24" color="rgba(71, 91, 216, 1)" ml="5%">
                      Espacio beneficio 4
                    </Text>
                  </Flex>
                </VStack>
              </Center>
              <Divider my="3" />
              <Center>
                <Button
                  w="90%"
                  _text={{fontSize: 20}}
                  bg="rgba(71, 91, 216, 1)">
                  Adquirir premium
                </Button>
              </Center>
            </Box>
          </Center>
        </Center>
      </View>
    </NativeBaseProvider>
  );
};

export default StudiallyPRO;
