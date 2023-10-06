import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CardSkeleton = () => {
  const shimmerValue = new Animated.Value(0);

  useEffect(() => {
    const animatedLoop = Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    animatedLoop.start();

    // Limpiar la animación al desmontar el componente
    return () => animatedLoop.stop();
  }, []);

  const shimmer = {
    transform: [
      {
        translateX: shimmerValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-350, 350],
        }),
      },
    ],
  };

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        style={styles.cardImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
      >
        <Animated.View style={[styles.shimmer, shimmer]} />
      </LinearGradient>

      <View style={styles.cardTextContainer}>
        <LinearGradient
          style={styles.cardTitle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        >
          <Animated.View style={[styles.shimmer, shimmer]} />
        </LinearGradient>
        <LinearGradient
          style={styles.cardSubtitle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        >
          <Animated.View style={[styles.shimmer, shimmer]} />
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // Tus estilos existentes
  },
  cardImage: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  cardTextContainer: {
    padding: 10,
  },
  cardTitle: {
    height: 30,
    marginBottom: 10,
    position: 'relative',
  },
  cardSubtitle: {
    height: 14,
    width: '90%',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default CardSkeleton;
