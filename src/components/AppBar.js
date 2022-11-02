import * as React from 'react';

// Native Base
import {Box, StatusBar, HStack, IconButton, Image} from 'native-base';

// assets
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StudiallyLogo from '../assets/images/Studially-logo.png';

import {useNavigation} from '@react-navigation/native';

function AppBar() {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar bg="#3700B3" barStyle="light-content" width={'100%'} />
      <Box safeAreaTop bg="white" width={'100px'} shadow="2" />
      <HStack
        bg="white"
        shadow="2"
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
              navigation.navigate('MasHome');
            }}
            icon={<MatComIcon name="menu" color="blue" size={24} />}
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
            size="xs"
            w={150}
          />
        </HStack>
      </HStack>
    </>
  );
}

export default AppBar;
