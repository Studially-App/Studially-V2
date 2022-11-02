/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {VStack, Text, View, Button, Heading} from 'native-base';
// Modal
import Modal from 'react-native-modal';

// Modal tiempo de enfoque terminado
const FocusFinishedModal = ({
  focusFinishedModalVisibility,
  setFocusFinishedModalVisibility,
  setBreakTimeModalVisibility,
}) => {
  return (
    <Modal
      isVisible={focusFinishedModalVisibility}
      statusBarTranslucent={true}
      style={{
        marginTop: '48%',
        marginBottom: '48%',
        borderRadius: 8,
      }}
      onBackdropPress={() => setFocusFinishedModalVisibility(false)}
      backgroundColor="white"
      backdropOpacity={0.72}>
      <View w="100%">
        <VStack space="3" alignItems="center">
          <Heading>Genial, has completado tu tiempo de enfoque</Heading>
          <Text fontSize="18" bold>
            ¿Qué deseas hacer?
          </Text>
          <Button
            bg="rgba(71, 91, 216, 1)"
            w="72%"
            onPress={() => {
              setFocusFinishedModalVisibility(false);
              setBreakTimeModalVisibility(true);
            }}>
            Ir a tiempo de descanso
          </Button>
          <Text
            onPress={() => setFocusFinishedModalVisibility(false)}
            underline
            fontSize="16">
            Omitir
          </Text>
        </VStack>
      </View>
    </Modal>
  );
};

export default FocusFinishedModal;
