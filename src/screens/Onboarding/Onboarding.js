import React, {useRef} from 'react';
import {NativeBaseProvider, View, FlatList} from 'native-base';
import {Animated} from 'react-native';
import DataOnboard from './DataOnboard';
import OnboardPage from './OnboardPage';

const Onboarding = ({navigation}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const slidesRef = useRef(null);

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <NativeBaseProvider>
      <View
        flex="1"
        justifyContent="center"
        alignItems="center"
        width="100%"
        bg="black">
        <View flex="3">
          <FlatList
            data={DataOnboard}
            renderItem={({item}) => (
              <OnboardPage
                item={item}
                scrollX={scrollX}
                navigation={navigation}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={true}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            ref={slidesRef}
            keyExtractor={item => item.id}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {
                useNativeDriver: false,
              },
            )}
          />
        </View>
      </View>
    </NativeBaseProvider>
  );
};

export default Onboarding;
