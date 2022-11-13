import * as React from 'react';
// Native Base
import {Box, VStack, HStack, Text, Spacer} from 'native-base';

const CardBeneficio = props => {
  return (
    <Box w="90%" bg="white" shadow={2} rounded={4}>
      <VStack m="15px">
        <Text fontSize="xl" bold>
          {props.titulo}
        </Text>
        <HStack>
          <Text fontSize="md" bold color="#475BD8">
            {props.organizacion}
          </Text>
          <Spacer />
          <Text fontSize="md">{props.fecha}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default CardBeneficio;
