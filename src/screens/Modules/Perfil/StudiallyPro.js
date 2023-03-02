import React, {useState} from 'react';
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
import functions from '@react-native-firebase/functions';
// Icons
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import StudiallyPROIcon from './StudiallyPRO.png';
import {StripeProvider} from '@stripe/stripe-react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {useUser} from '../../../context/User';

const StudiallyPRO = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const {userInfo, user, refreshTier} = useUser();

  const openPaymentSheet = async () => {
    try {
      setLoading(true);
      const fetchPaymentSheetParams = async () => {
        const response = await functions().httpsCallable('createSubscription')({
          priceId: 'price_1Mh2lnAX9PxeRGsUGz8oQQjs',
        });
        const {clientSecret, ephemeralKey, customer} = response.data;

        return {
          clientSecret,
          ephemeralKey,
          customer,
        };
      };

      const initializePaymentSheet = async () => {
        const {customer, ephemeralKey, clientSecret} =
          await fetchPaymentSheetParams();
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
            googlePay: {
              merchantCountryCode: 'US',
              testEnv: true, // use test environment
            },
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NativeBaseProvider>
      <StripeProvider publishableKey="pk_test_51Me4GBAX9PxeRGsU1wcpPqZdRg8tQHB2BjLECNbAT9jF0XRrZX96Q6fdXhUmdvmtsODc7BTC6VhNyHjvSuzODahs00JoJE7BwH">
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
                      <Text fontSize="18">Primer mes gratis</Text>
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
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Gana premios por tu tiempo de enfoque
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Sigue más de 2 hábitos
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Agrega a tus amigos y ve su avance
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Logra múltiples metas financieras
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Accede a oportunidades increíbles
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Aprende de diversos temas
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Cuida tu salud mental
                      </Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                      <MaterialIcon
                        name="check"
                        color="rgba(39, 44, 70, 1)"
                        size={16}
                      />
                      <Text fontSize="15" color="rgba(71, 91, 216, 1)" ml="5%">
                        Obtén beneficios con nuestros partners
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
                    isLoading={loading}
                    disabled={loading}
                    onPress={openPaymentSheet}>
                    Adquirir premium
                  </Button>
                </Center>
              </Box>
            </Center>
          </Center>
        </View>
      </StripeProvider>
    </NativeBaseProvider>
  );
};

export default StudiallyPRO;
