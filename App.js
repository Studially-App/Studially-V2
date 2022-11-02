import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider, Box} from 'native-base';

import {Text} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Onboarding from './src/screens/Onboarding/Onboarding';

import Welcome from './src/screens/Register/Welcome';
import SignIn from './src/screens/Register/SignIn';
import SignUp from './src/screens/Register/SignUp';
import ResetPassword from './src/screens/Register/ResetPassword';

const Tabs = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

const Tab1 = () => <Text>Tab1</Text>;
const Tab2 = () => <Text>Tab2</Text>;
const Tab3 = () => <Text>Tab3</Text>;
const Tab4 = () => <Text>Tab4</Text>;

const condition = 1;

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {condition === 0 ? (
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
              name="Hábitos"
              component={Tab1}
              options={{
                tarBarLabel: 'Hábitos',
                tabBarLabelStyle: {
                  fontSize: 12,
                  marginBottom: 4,
                },
                tabBarIcon: ({color, size}) => (
                  <Box
                    _pressed={{
                      backgroundColor: 'rgba(71, 91, 216, 1)',
                    }}>
                    <Icon
                      name="clipboard-check-outline"
                      color={color}
                      size={24}
                    />
                  </Box>
                ),
              }}
            />
            <Tabs.Screen
              name="Enfoque"
              component={Tab2}
              options={{
                tarBarLabel: 'Enfoque',
                tabBarLabelStyle: {
                  fontSize: 12,
                  marginBottom: 4,
                },
                tabBarIcon: ({color, size}) => (
                  <Icon name="timer-sand-empty" color={color} size={24} />
                ),
              }}
            />
            <Tabs.Screen
              name="Finanzas"
              component={Tab3}
              options={{
                tarBarLabel: 'Finanzas',
                tabBarLabelStyle: {
                  fontSize: 12,
                  marginBottom: 4,
                },
                tabBarIcon: ({color, size}) => (
                  <Icon name="wallet-outline" color={color} size={24} />
                ),
              }}
            />
            <Tabs.Screen
              name="Recursos"
              component={Tab4}
              options={{
                tarBarLabel: 'Recursos',
                tabBarLabelStyle: {
                  fontSize: 12,
                  marginBottom: 4,
                },
                tabBarIcon: ({color, size}) => (
                  <Icon name="notebook-outline" color={color} size={24} />
                ),
              }}
            />
          </Tabs.Navigator>
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
