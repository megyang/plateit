import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

type Props = {
  front: React.ReactNode;
  back: React.ReactNode;
  onDoubleTap?: () => void;
};

export default function FlipCard({ front, back, onDoubleTap }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const flippedRef = useRef(false);
  const lastTapRef = useRef<number>(0);

  const flip = () => {
    const toValue = flippedRef.current ? 0 : 180;
    Animated.timing(rotation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      flippedRef.current = !flippedRef.current;
    });
  };

  const handleTap = () => {
    const now = Date.now();
    if (lastTapRef.current && now - lastTapRef.current < 300) {
      // Double tap
      onDoubleTap?.();
    } else {
      flip(); // single tap = flip
    }
    lastTapRef.current = now;
  };

  const frontInterpolate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
          {front}
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          {back}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 'auto',
    marginBottom: 20,
  },
  card: {
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
});
