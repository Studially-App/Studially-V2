/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {STRIPE_KEY} from '@env';
import {
  VStack,
  Flex,
  Text,
  Center,
  Button,
  Box,
  Image,
  Divider,
} from 'native-base';
// Modal
import Modal from 'react-native-modal';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import StudiallyPROIcon from '../screens/Modules/Perfil/StudiallyPRO.png';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import {useUser} from '../context/User';
import functions from '@react-native-firebase/functions';
import Communications from 'react-native-communications';

// Modal Stop
const StudiallyProModal = ({proModalVisibility, setProModalVisibility}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const {userInfo, user, refreshTier} = useUser();

  const handleEmail = () => {
    // El primer argumento es la dirección de correo electrónico del destinatario
    // El segundo argumento es el asunto del correo electrónico
    // El tercer argumento es el cuerpo del correo electrónico
    Communications.email(['developer@devri.com.mx'], null, null, 'Suscripción Pro', 'Hola, quisiera ser Studialler PRO');
  };


  const openPaymentSheet = async () => {
    try {
      setLoading(true);
      const fetchPaymentSheetParams = async () => {
        const response = await functions().httpsCallable('createSubscription')({
          priceId: 'price_1NXUONAX9PxeRGsUebhC6eSp',
        });
        const {clientSecret, ephemeralKey, customer} = response.data;

        console.log(response.data);

        return {
          clientSecret,
          ephemeralKey,
          customer,
        };
      };

      const initializePaymentSheet = async () => {
        const {customer, ephemeralKey, clientSecret} = await fetchPaymentSheetParams();
        const {error} = await initPaymentSheet({
          merchantDisplayName: 'Studially',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: clientSecret,
          // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
          //methods that complete payment after a delay, like SEPA Debit and Sofort.
          allowsDelayedPaymentMethods: false,
          defaultBillingDetails: {
            name: `${userInfo.nombres} ${userInfo.apellidos}`,
            email: user.email,
            address: {country: 'MX'},
          },
          googlePay: {
            merchantCountryCode: 'MX',
            testEnv: false, // use test environment
          },
        });
        if (!error) {
          setLoading(false);
        }
      };

      await initializePaymentSheet();
      const {error} = await presentPaymentSheet();

      if (error) {
        console.error(`Error code: ${error.code}`, error.message);
      } else {
        console.log('Success', 'Your order is confirmed!');
        refreshTier();
        setProModalVisibility(false);
      }
    } catch (error) {
      console.error('Hubo un error' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={proModalVisibility}
      style={{
        borderRadius: 8,
      }}
      onBackdropPress={() => setProModalVisibility(false)}>
      <Center w="100%">
        <Box
          w="90%"
          bg="rgba(255, 255, 255, 1)"
          mb={5}
          pb={5}
          shadow="9"
          rounded="12">
          <Center>
            <Box justifyContent="center" w="90%">
              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                mt={5}>
                <Image source={StudiallyPROIcon} alt="StudiallyPROIcon" />
                <MaterialIcon
                  name="close"
                  color="rgba(39, 44, 70, 1)"
                  size={18}
                  onPress={() => setProModalVisibility(false)}
                />
              </Flex>
            </Box>
          </Center>
          {/*<Center>
            <VStack>
              <Text fontSize="30" bold>
                90<Text fontSize="16">MXN</Text> / mes
              </Text>
              <Flex direction="column" alignItems="flex-start" ml="2%">
                <Text fontSize="18">Primer mes gratis</Text>
              </Flex>
            </VStack>
          </Center>*/}
          <Divider my="3" />
          <Center my={2}>
            <VStack space={1}>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Estadísticas de organización
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Ganar premios con retos
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Seguir más de 2 hábitos
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Estadísticas de hábitos
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Agregar amigos y ver su avance
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Más de 1 meta financiera
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Acceso ilimitado a recursos
                </Text>
              </Flex>
              <Flex direction="row" alignItems="center">
                <MaterialIcon
                  name="check"
                  color="rgba(39, 44, 70, 1)"
                  size={13}
                />
                <Text fontSize="13" color="rgba(71, 91, 216, 1)" ml="3%">
                  Beneficios y oportunidades
                </Text>
              </Flex>
            </VStack>
          </Center>
          <Divider my="3" />
          <Center>
            <Button
              w="90%"
              _text={{fontSize: 20}}
              bg="rgba(71, 91, 216, 1)"
              disabled={loading}
              isLoading={loading}
              onPress={handleEmail}>
              Contacto
            </Button>
          </Center>
        </Box>
      </Center>
    </Modal>
  );
};

export default ({proModalVisibility, setProModalVisibility}) => (
  <StripeProvider publishableKey={STRIPE_KEY}>
    <StudiallyProModal
      proModalVisibility={proModalVisibility}
      setProModalVisibility={setProModalVisibility}
    />
  </StripeProvider>
);
