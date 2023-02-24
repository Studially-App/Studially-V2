import React from 'react';
import {View} from 'native-base';

const Paginator = ({data, scrollX, id}) => {
  return (
    <View flexDirection="row" h={4} mb={6}>
      {data.map((item, i) => {
        if (item.id === id) {
          return (
            <View
              key={i.toString()}
              h={3.5}
              borderRadius={7}
              mx={4}
              w={3.5}
              backgroundColor="#000"
              borderWidth="2"
              borderColor="white"
            />
          );
        } else {
          return (
            <View
              key={i.toString()}
              h={3.5}
              borderRadius={7}
              mx={4}
              w={3.5}
              backgroundColor="#fff"
              borderWidth="2"
              borderColor="white"
            />
          );
        }
      })}
    </View>
  );
};

export default Paginator;
