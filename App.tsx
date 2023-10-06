/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
import { NavigationContainer, RouteProp, useNavigation, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  NativeBaseProvider,
  Box,
  Center,
  HStack,
  IconButton,
  Image,
} from 'native-base';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StudiallyLogo from './src/assets/images/Studially-logo.png';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { useWindowDimensions, Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Onboarding from './src/screens/Onboarding/Onboarding';
import Welcome from './src/screens/Register/Welcome';
import SignIn from './src/screens/Register/SignIn';
import SignUp from './src/screens/Register/SignUp';
import ResetPassword from './src/screens/Register/ResetPassword';

import Habitos from './src/screens/Modules/Habitos/Habitos';
import Finanzas from './src/screens/Modules/Finanzas/Finanzas';
import Enfoque from './src/screens/Modules/Enfoque/Enfoque';
import Recursos from './src/screens/Modules/Recursos/Recursos';

import MarcarHabitos from './src/screens/Modules/Habitos/MarcarHabitos';
import AgregarHabitos from './src/screens/Modules/Habitos/AgregarHabitos';
import Estadisticas from './src/screens/Modules/Habitos/Estadisticas';

import OportunidadesLista from './src/screens/Modules/Recursos/OportunidadesLista';
import SaludMentalLista from './src/screens/Modules/Recursos/SaludMentalLista';
import AprendizajeLista from './src/screens/Modules/Recursos/AprendizajeLista';
import ComunidadLista from './src/screens/Modules/Recursos/ComunidadLista';

import StudiallyRewards from './src/screens/Modules/Enfoque/StudiallyRewards';
import EstadisticasEnfoque from './src/screens/Modules/Enfoque/EstadisticasEnfoque';

import Mas from './src/screens/Modules/Perfil/Mas';
import Profile from './src/screens/Modules/Perfil/Profile';
import StudiallyPRO from './src/screens/Modules/Perfil/StudiallyPro';
import {
  requestNotificationPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
} from './src/utils/notifications';
import { UserProvider, useUser } from './src/context/User';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import analytics from '@react-native-firebase/analytics';



const Tabs = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const HabitosStack = createNativeStackNavigator();
const RecursosStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();
const EnfoqueStack = createNativeStackNavigator();

type AuthStackParamList = {
  SignUp: undefined; // asume que 'SignUp' no tiene parámetros, cambia esto si es necesario
  // define otros nombres de pantalla aquí si los tienes
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'SignUp'
>;

type SignUpScreenRouteProp = RouteProp<AuthStackParamList, 'SignUp'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
  onUserCreated: (user: any) => void; // cambia 'any' a tu tipo de usuario si tienes uno
};


const HabitosStackScreen = () => (
  <HabitosStack.Navigator>
    <HabitosStack.Screen
      name="Mis Habitos"
      component={Habitos}
      options={{
        headerShown: false,
      }}
    />
    <HabitosStack.Screen
      name="Agregar Habitos"
      component={AgregarHabitos}
      options={{
        headerShown: false,
      }}
    />
    <HabitosStack.Screen
      name="Marcar Habitos"
      component={MarcarHabitos}
      options={{
        headerShown: false,
      }}
    />
    <HabitosStack.Screen
      name="Estadísticas"
      component={Estadisticas}
      options={{
        headerShown: false,
      }}
    />
  </HabitosStack.Navigator>
);

const RecursosStackScreen = () => (
  <RecursosStack.Navigator>
    <RecursosStack.Screen
      name="RecursosHome"
      component={Recursos}
      options={{
        headerShown: false,
      }}
    />
    <RecursosStack.Screen
      name="Oportunidades"
      component={OportunidadesLista}
      options={{
        headerShown: false,
      }}
    />
    <RecursosStack.Screen
      name="Salud Mental"
      component={SaludMentalLista}
      options={{
        headerShown: false,
      }}
    />
    <RecursosStack.Screen
      name="Aprendizaje"
      component={AprendizajeLista}
      options={{
        headerShown: false,
      }}
    />
    <RecursosStack.Screen
      name="Comunidad"
      component={ComunidadLista}
      options={{
        headerShown: false,
      }}
    />
  </RecursosStack.Navigator>
);

const EnfoqueStackScreen = () => (
  <EnfoqueStack.Navigator>
    <EnfoqueStack.Screen
      name="Enfoque"
      component={Enfoque}
      options={{
        headerShown: false,
      }}
    />
    <EnfoqueStack.Screen
      name="Rewards"
      component={StudiallyRewards}
      options={{
        headerShown: false,
      }}
    />
    <EnfoqueStack.Screen
      name="Estadisticas"
      component={EstadisticasEnfoque}
      options={{
        headerShown: false,
      }}
    />
  </EnfoqueStack.Navigator>
);

const withUserCreated = (Component: React.ComponentType<any>, onUserCreated: (user: any) => void) => {
  return (props: any) => <Component {...props} onUserCreated={onUserCreated} />;
};

const App = () => {
  const [profile, setProfile] = useState(false);
  const { user, initialized, userTier } = useUser();
  const [isNewUser, setIsNewUser] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const routeNameRef = React.useRef<string | null>(null);
  const navigationRef = React.useRef<NavigationContainerRef<any> | null>(null);


  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onUserCreated = () => {
    setModalVisible(true);
    setIsNewUser(true); // Cambia la variable de estado a verdadero cuando un nuevo usuario se registra
  };
  //console.log(user.providerData);

  useEffect(() => {
    if (initialized && user) {
      requestNotificationPermission();
      subscribeToTopic('all');
      if (userTier === 'premium') {
        subscribeToTopic('premium');
        unsubscribeFromTopic('free');
      } else {
        subscribeToTopic('free');
        unsubscribeFromTopic('premium');
      }
    }
  }, [initialized, user, userTier]);

  if (!initialized) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name || null;

      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name || null;

        console.log(currentRouteName);
      }}
      
      >
        {user && !profile ? (
          <>
          
            <Center safeAreaTop bg="white">
              {/*<Box safeAreaTop bg="white" width={'100px'} shadow="2" />*/}
              <HStack
                bg="white"
                px="1"
                py="3"
                justifyContent="flex-start"
                alignItems="center"
                w="100%">
                <HStack
                  alignItems="flex-start"
                  space={1}
                  justifyContent="flex-start"
                  w={'10%'}>
                  <IconButton
                    onPress={() => {
                      console.log('Abrir mas');
                      setProfile(true);
                    }}
                    icon={<MatComIcon name="menu" color="blue" size={28} />}
                  />
                </HStack>
                <HStack
                  alignItems="flex-start"
                  space={6}
                  justifyContent="center"
                  w={'90%'}>
                  <Image
                    source={StudiallyLogo}
                    alt="StudiallyLogo"
                    // h="%"
                    size="9"
                    w="100%"
                    resizeMode='contain'
                  />
                </HStack>
              </HStack>
            </Center>
            <Tabs.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  position: 'absolute',
                  backgroundColor: 'rgba(249, 249, 249, 1)',
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: hp('1%'),
                  height: hp('9%'),
                  width: wp('100%'),
                },
                tabBarInactiveTintColor: 'rgba(39, 44, 70, 1)',
                tabBarHideOnKeyboard: true,
              }}>
              <Tabs.Screen
                name="Organización"
                component={EnfoqueStackScreen}
                options={{
                  title: 'Organización',
                  tabBarLabelStyle: {
                    fontSize: wp('2.7%'),
                    marginBottom: 4,
                  },
                  tabBarIcon: ({ color }) => (
                    <Box>
                      <IonIcon name="timer-outline" color={color} size={24} />
                    </Box>
                  ),
                }}
              />
              <Tabs.Screen
                name="Hábitos"
                component={HabitosStackScreen}
                options={{
                  title: 'Hábitos',
                  tabBarLabelStyle: {
                    fontSize: wp('2.7%'),
                    marginBottom: 4,
                  },
                  tabBarIcon: ({ color }) => (
                    <Icon name="heart-outline" color={color} size={24} />
                  ),
                }}
              />
              <Tabs.Screen
                name="Finanzas"
                component={Finanzas}
                options={{
                  title: 'Finanzas',
                  tabBarLabelStyle: {
                    fontSize: wp('2.7%'),
                    marginBottom: 4,
                  },
                  tabBarIcon: ({ color }) => (
                    <Icon name="piggy-bank-outline" color={color} size={24} />
                  ),
                }}
              />
              <Tabs.Screen
                name="Recursos"
                component={RecursosStackScreen}
                options={{
                  title: 'Recursos',
                  tabBarLabelStyle: {
                    fontSize: wp('2.7%'),
                    marginBottom: 4,
                  },
                  tabBarIcon: ({ color }) => (
                    <Icon name="star-outline" color={color} size={24} />
                  ),
                }}
              />
            </Tabs.Navigator>
          </>
        ) : user && profile ? (
          <>
            <Center safeAreaTop bg="white">
              {/*<Box safeAreaTop bg="white" width={'100px'} shadow="2" />*/}
              <HStack
                bg="white"
                px="1"
                py="3"
                justifyContent="flex-start"
                alignItems="center"
                w="100%">
                <HStack
                  alignItems="flex-start"
                  space={1}
                  justifyContent="flex-start"
                  w={'10%'}>
                  <IconButton
                    onPress={() => {
                      console.log('Ir a home');
                      setProfile(false);
                    }}
                    icon={<MatComIcon name="home" color="blue" size={28} />}
                  />
                </HStack>
                <HStack
                  alignItems="flex-start"
                  space={6}
                  justifyContent="center"
                  w={'90%'}>
                  <Image
                    source={StudiallyLogo}
                    alt="StudiallyLogo"
                    // h="%"
                    size="9"
                    w="100%"
                    resizeMode='contain'
                  />
                </HStack>
              </HStack>
            </Center>
            <PerfilStack.Navigator>
              <PerfilStack.Screen
                name="MasHome"
                component={Mas}
                options={{
                  headerShown: false,
                }}
              />
              <PerfilStack.Screen
                name="Perfil"
                component={Profile}
                options={{
                  headerShown: false,
                }}
              />
              <PerfilStack.Screen
                name="Studially Pro"
                component={StudiallyPRO}
                options={{
                  headerShown: false,
                }}
              />
            </PerfilStack.Navigator>
          </>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="SignUp"
              component={withUserCreated(SignUp, onUserCreated)}
              options={{ headerShown: false }}
            />
            <AuthStack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{ headerShown: false }}
            />
          </AuthStack.Navigator>
        )}

        {isNewUser && (
          <Modal animationType="slide" visible={modalVisible} >
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal} >
                <MaterialIcon name="close" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.videoContainer}>
                <WebView source={{ uri: 'https://www.youtube.com/embed/51MHvaOiBJc?autoplay=1' }} style={styles.webView} />
              </View>
            </View>
          </Modal>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

const AppWrapper = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  videoContainer: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    alignSelf: 'stretch',
    aspectRatio: 9 / 16,
  },
});


export default AppWrapper;
