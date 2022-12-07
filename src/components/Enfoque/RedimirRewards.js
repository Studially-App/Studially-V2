import * as React from 'react';
import {useState} from 'react';
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

const RedimirRewards = ({modalVisibility, setModalVisibility}) => {
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

  const sendData = () => {
    console.log(
      nombre,
      apellidos,
      correo,
      calleDireccion,
      numExtDireccion,
      numIntDireccion,
      colDireccion,
      cp,
      municipio,
      pais,
    );
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
                    placeholder={'Colonia'}
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
