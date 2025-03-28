import { useRef } from 'react';
import { Animated } from 'react-native';

export default function useFlip() {
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipToFront = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const flipToBack = () => {
    Animated.timing(flipAnim, {
      toValue: 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return { flipAnim, flipToFront, flipToBack };
}
