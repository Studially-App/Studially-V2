import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider, Box, Center} from 'native-base';
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AppBar from './src/components/AppBar';

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

const Tabs = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const HabitosStack = createNativeStackNavigator();

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

const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(loggedUser) {
    setUser(loggedUser);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //SplashScreen.hide();
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {user ? (
          <>
            <Center>
              <AppBar />
            </Center>
            <Tabs.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  position: 'absolute',
                  backgroundColor: 'rgba(249, 249, 249, 1)',
                  marginLeft: '2.5%',
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  marginBottom: '5%',
                  height: '9%',
                  width: '95%',
                },
                tabBarInactiveTintColor: 'rgba(39, 44, 70, 1)',
              }}>
              <Tabs.Screen
                name="Organización"
                component={Enfoque}
                options={{
                  tarBarLabel: 'Organización',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                  },
                  tabBarIcon: ({color, size}) => (
                    <Box
                      _pressed={{
                        backgroundColor: 'rgba(71, 91, 216, 1)',
                      }}>
                      <IonIcon name="timer-outline" color={color} size={24} />
                    </Box>
                  ),
                }}
              />
              <Tabs.Screen
                name="Hábitos"
                component={HabitosStackScreen}
                options={{
                  tarBarLabel: 'Hábitos',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="heart-outline" color={color} size={24} />
                  ),
                }}
              />
              <Tabs.Screen
                name="Finanzas"
                component={Finanzas}
                options={{
                  tarBarLabel: 'Finanzas',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="piggy-bank-outline" color={color} size={24} />
                  ),
                }}
              />
              <Tabs.Screen
                name="Recursos"
                component={Recursos}
                options={{
                  tarBarLabel: 'Recursos',
                  tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 4,
                  },
                  tabBarIcon: ({color, size}) => (
                    <Icon name="star-outline" color={color} size={24} />
                  ),
                }}
              />
            </Tabs.Navigator>
          </>
        ) : (
          <AuthStack.Navigator options={{headerShown: false}}>
            <AuthStack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{headerShown: false}}
            />
            <AuthStack.Screen
              name="Welcome"
              component={Welcome}
              options={{headerShown: false}}
            />
            <AuthStack.Screen
              name="SignIn"
              component={SignIn}
              options={{headerShown: false}}
            />
            <AuthStack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerShown: false}}
            />
            <AuthStack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{headerShown: false}}
            />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
