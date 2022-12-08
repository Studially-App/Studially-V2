import * as React from 'react';
import {
  VStack,
  Input,
  HStack,
  Text,
  Pressable,
  View,
  Circle,
  useToast,
  Modal,
  Button,
  NativeBaseProvider,
  // FlatList,
  Heading,
} from 'native-base';

// Icons
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FoundationIcon from 'react-native-vector-icons/Foundation';

const BreakTimeModal = ({
  breakTimeModalVisibility,
  setBreakTimeModalVisibility,
  setBreakOutActive,
  minutsInput,
  setMinutsInput,
  breakOutTime,
  setBreakOutTime,
  setBreakOutOn,
}) => {
  // Toast
  const toast = useToast();

  return (
    <NativeBaseProvider>
      <View>
        <Modal
          isOpen={breakTimeModalVisibility}
          onClose={() => {
            setBreakTimeModalVisibility(false);
            setMinutsInput('0');
          }}>
          <Modal.Content w="90%" justify="flex-end">
            <Modal.Body>
              <View flex={1}>
                <VStack space="8" alignItems="center" h="100%" w="100%" py="4">
                  <Heading noOfLines={2}>
                    Selecciona tu tiempo de descanso
                  </Heading>
                  <HStack space="4" alignItems="center">
                    <HStack space="2">
                      <Circle bg="rgba(71, 91, 216, 1)" size="40px">
                        <Pressable
                          onPress={() => {
                            let temp = parseInt(minutsInput, 10) - 1;
                            setBreakOutTime(temp);
                            setMinutsInput(temp.toString());
                          }}>
                          <FoundationIcon
                            name="minus"
                            size={16}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Pressable>
                      </Circle>
                      <Input
                        variant="outline"
                        placeholder={minutsInput}
                        w="24"
                        maxLength={2}
                        keyboardType="numeric"
                        textAlign="center"
                        defaultValue={minutsInput}
                        onChangeText={text => {
                          setBreakOutTime(parseInt(text, 10) * 60);
                          setMinutsInput(text);
                        }}
                        _focus={{
                          borderColor: 'rgba(71, 91, 216, 1)',
                        }}
                      />
                      <Circle bg="rgba(71, 91, 216, 1)" size="40px">
                        <Pressable
                          onPress={() => {
                            let temp = parseInt(minutsInput, 10) + 1;
                            setBreakOutTime(temp * 60);
                            setMinutsInput(temp.toString());
                          }}>
                          <MaterialCommunityIcon
                            name="plus-thick"
                            size={18}
                            color="rgba(255, 255, 255, 1.0)"
                          />
                        </Pressable>
                      </Circle>
                    </HStack>
                    <Text fontSize="20" bold>
                      Minutos
                    </Text>
                  </HStack>
                  <Button
                    bg="rgba(71, 91, 216, 1)"
                    mt="2"
                    w="80%"
                    onPress={() => {
                      if (minutsInput >= '0' && breakOutTime !== null) {
                        setBreakOutActive(true);
                        setBreakTimeModalVisibility(false);
                        setBreakOutOn(true);
                      }
                      if (minutsInput <= '0' && breakOutTime === null) {
                        toast.show({
                          description: 'Selecciona un tiempo de descanso',
                          duration: 1000,
                          placement: 'top',
                        });
                      }
                    }}>
                    Aplicar
                  </Button>
                </VStack>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </View>
    </NativeBaseProvider>
  );
};

export default BreakTimeModal;
