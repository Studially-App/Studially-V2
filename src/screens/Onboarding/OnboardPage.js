import React from 'react';
import {useWindowDimensions} from 'react-native';
import {View, Text, VStack, Center, Image, Button} from 'native-base';
import Paginator from './Paginator';
import DataOnboard from './DataOnboard';

export default function OnboardPage({item, scrollX, navigation}) {
  const {width} = useWindowDimensions();

  return (
    <View w={width} flex="1" justifyContent="flex-end" alignItems="center">
      <Image
        source={{
          uri: item.imgURL,
        }}
        alt="Fondo onboarding"
        size="xl"
        resizeMode="cover"
        position="absolute"
        w={'100%'}
        h={'100%'}
      />
      <VStack space={3} mb={8} w="100%">
        <Center mb={2}>
          <Text bold fontSize="26" color="white">
            {item.title}
          </Text>
        </Center>
      </VStack>
      <Center>
        <Paginator data={DataOnboard} scrollX={scrollX} id={item.id} />
        <Button
          size={'2xl'}
          bg="#FAFAFA"
          px="40%"
          mb={4}
          _text={{color: 'black'}}
          _pressed={{
            backgroundColor: '#c6c6c6',
          }}
          onPress={() => {
            navigation.navigate('Welcome');
          }}>
          Saltar
        </Button>
      </Center>
    </View>
  );
}
