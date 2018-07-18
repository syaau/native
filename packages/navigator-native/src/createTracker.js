// @flow
import { Animated } from 'react-native';

export default function createTracker(parts) {
  const tracker = {
    track: (value, transition, to) => {
      value.stopAnimation((currentValue) => {
        // When the transition is complete, reset the value to the final position
        transition.addCompleteListener(() => value.setValue(to));
        Animated.timing(value, {
          toValue: transition.driver.interpolate({
            inputRange: [0, 1],
            outputRange: [currentValue, to],
          }),
          duration: 0,
          useNativeDriver: true,
        }).start();
      });
      return tracker;
    },
    fadeIn: transition => tracker.track(parts.opacity, transition, 1),
    fadeOut: transition => tracker.track(parts.opacity, transition, 0),
    zoomIn: transition => tracker.track(parts.scale, transition, 1),
    zoomOut: (transition, to = 0.01) => tracker.track(parts.scale, transition, to),
    moveX: (transition, x) => tracker.track(parts.translateX, transition, x),
    moveY: (transition, y) => tracker.track(parts.translateY, transition, y),
    move: (transition, x, y) => tracker.moveX(transition, x).moveY(transition, y),
  };

  return tracker;
}
