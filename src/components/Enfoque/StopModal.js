/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {VStack, HStack, Text, View, Button, Heading} from 'native-base';
// Modal
import Modal from 'react-native-modal';

// Modal Stop
const StopModal = ({
  stopModalVisibility,
  setStopModalVisibility,
  restartTimer,
}) => {
  return (
    <Modal
      isVisible={stopModalVisibility}
      backgroundColor="white"
      backdropOpacity={0.72}
      style={{
        marginTop: '56%',
        marginBottom: '56%',
        borderRadius: 8,
      }}
      onBackdropPress={() => setStopModalVisibility(false)}>
      <View
        flex="1"
        p="22"
        style={{
          // padding: 22,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <VStack space="3" alignItems="center">
          <Heading>Atención</Heading>
          <Text fontSize="18" noOfLines={3}>
            Si detienes el temporizador tu tiempo de enfoque volverá a cero
          </Text>
          <HStack space="3">
            <Button
              bg="rgba(71, 91, 216, 1)"
              _pressed={{bg: '#324099'}}
              onPress={() => setStopModalVisibility(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              borderColor="rgba(71, 91, 216, 1)"
              _pressed={{bg: 'white', borderColor: 'rgba(71, 91, 216, 1)'}}
              _text={{
                color: 'rgba(71, 91, 216, 1)',
              }}
              onPress={() => {
                restartTimer();
                setStopModalVisibility(false);
              }}>
              Detener
            </Button>
          </HStack>
        </VStack>
      </View>
    </Modal>
  );
};

export default StopModal;
