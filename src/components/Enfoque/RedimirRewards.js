import * as React from 'react';
import {useState} from 'react';
import {
  VStack,
  Input,
  HStack,
  Text,
  View,
  Modal,
  Button,
  NativeBaseProvider,
  useToast,
} from 'native-base';

import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const RedimirRewards = ({modalVisibility, setModalVisibility, idProducto}) => {
  // Toast
  const toast = useToast();

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [calleDireccion, setCalleDireccion] = useState('');
  const [numExtDireccion, setNumExtDireccion] = useState('');
  const [numIntDireccion, setNumIntDireccion] = useState('');
  const [colDireccion, setColDireccion] = useState('');
  const [cp, setCp] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [pais, setPais] = useState('');

  const sendData = async () => {
    try {
      var redimirId = uuid.v4();
      const today = new Date();
      await firestore().collection('redimirRewards').doc(redimirId).set({
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        calleDireccion: calleDireccion,
        numExtDireccion: numExtDireccion,
        numIntDireccion: numIntDireccion,
        colDireccion: colDireccion,
        cp: cp,
        municipio: municipio,
        pais: pais,
        idProducto: idProducto,
        redimirId: redimirId,
        fecha: today,
      });
      return toast.show({
        description: 'Recibimos su solicitud, espera un correo de nosotros',
        duration: 3000,
        placement: 'top',
      });
    } catch (error) {
      console.log(error);
      return toast.show({
        description:
          'Tuvimos un error al procesar su solicitud, inténtelo más tarde',
        duration: 3000,
        placement: 'top',
      });
    }
  };

  return (
    <NativeBaseProvider>
      <View>
        <Modal
          isOpen={modalVisibility}
          onClose={() => {
            setModalVisibility(false);
          }}>
          <Modal.Content w="90%" justify="flex-end">
            <Modal.Body>
              <View flex={1}>
                <VStack space="3" h="100%" w="100%">
                  <Text fontSize="20px" fontWeight={'bold'}>
                    Redimir producto
                  </Text>
                  <Text>Llena este formulario para mandar tu solicitud</Text>

                  <Input
                    variant="outline"
                    placeholder={'Nombre(s)'}
                    w="100%"
                    onChangeText={text => {
                      setNombre(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />
                  <Input
                    variant="outline"
                    placeholder={'Apellidos'}
                    w="100%"
                    onChangeText={text => {
                      setApellidos(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />
                  <Input
                    variant="outline"
                    placeholder={'Correo Electrónico'}
                    w="100%"
                    onChangeText={text => {
                      setCorreo(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />
                  <Text>Dirección de envío</Text>
                  <Input
                    variant="outline"
                    placeholder={'Calle'}
                    w="100%"
                    onChangeText={text => {
                      setCalleDireccion(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />
                  <HStack justifyContent="space-between">
                    <Input
                      variant="outline"
                      placeholder={'Num ext'}
                      w="45%"
                      onChangeText={text => {
                        setNumExtDireccion(text);
                      }}
                      _focus={{
                        borderColor: 'rgba(71, 91, 216, 1)',
                      }}
                    />
                    <Input
                      variant="outline"
                      placeholder={'Num int'}
                      w="45%"
                      onChangeText={text => {
                        setNumIntDireccion(text);
                      }}
                      _focus={{
                        borderColor: 'rgba(71, 91, 216, 1)',
                      }}
                    />
                  </HStack>
                  <Input
                    variant="outline"
                    placeholder={'Colonia'}
                    w="100%"
                    onChangeText={text => {
                      setColDireccion(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />
                  <HStack justifyContent="space-between">
                    <Input
                      variant="outline"
                      placeholder={'C.P.'}
                      w="45%"
                      onChangeText={text => {
                        setCp(text);
                      }}
                      _focus={{
                        borderColor: 'rgba(71, 91, 216, 1)',
                      }}
                    />
                    <Input
                      variant="outline"
                      placeholder={'Municipio'}
                      w="45%"
                      onChangeText={text => {
                        setMunicipio(text);
                      }}
                      _focus={{
                        borderColor: 'rgba(71, 91, 216, 1)',
                      }}
                    />
                  </HStack>
                  <Input
                    variant="outline"
                    placeholder={'País'}
                    w="100%"
                    onChangeText={text => {
                      setPais(text);
                    }}
                    _focus={{
                      borderColor: 'rgba(71, 91, 216, 1)',
                    }}
                  />

                  <HStack justifyContent="space-between">
                    <Button
                      bg="white"
                      borderColor="rgba(71, 91, 216, 1)"
                      borderStyle="solid"
                      borderWidth="1"
                      mt="2"
                      w="45%"
                      onPress={() => {
                        setModalVisibility(false);
                      }}>
                      <Text color="rgba(71, 91, 216, 1)">Cancelar</Text>
                    </Button>
                    <Button
                      bg="rgba(71, 91, 216, 1)"
                      mt="2"
                      w="45%"
                      onPress={() => {
                        sendData();
                        setModalVisibility(false);
                      }}>
                      Redimir
                    </Button>
                  </HStack>
                </VStack>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </View>
    </NativeBaseProvider>
  );
};

export default RedimirRewards;
