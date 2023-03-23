/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {VStack, HStack, Text, View, Button, Heading} from 'native-base';
// Modal
import Modal from 'react-native-modal';

const ModalMetaFinalizada = ({
  congratsModalVisibility,
  setCongratsModalVisibility
}) => {
  return (
    <Modal
      isVisible={congratsModalVisibility}
      backgroundColor="white"
      backdropOpacity={0.72}
      style={{
        marginTop: '56%',
        marginBottom: '56%',
        borderRadius: 8,
      }}
      onBackdropPress={() => setCongratsModalVisibility(false)}>
      <View
        flex="1"
        p="22"
        style={{
          // padding: 22,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <VStack space="3" alignItems="center">
          <Heading>¡Felicidades!</Heading>
          <Text fontSize="18" noOfLines={3}>
            Lograste completar tu meta, estas mejorando tu habilidad para ahorrar. ¡Tú puedes!
          </Text>
          <HStack space="3">
            <Button
              variant="outline"
              borderColor="rgba(71, 91, 216, 1)"
              _pressed={{bg: 'white', borderColor: 'rgba(71, 91, 216, 1)'}}
              _text={{
                color: 'rgba(71, 91, 216, 1)',
              }}
              onPress={() => {
                setCongratsModalVisibility(false);
                console.log('Felicidades meta')
              }}>
              Aceptar
            </Button>
          </HStack>
        </VStack>
      </View>
    </Modal>
  );
};

export default ModalMetaFinalizada;
