// @flow
import { Animated } from 'react-native';
import type { TimingAnimationConfig } from 'react-native/Libraries/Animated/src/animations/TimingAnimation';
import type { SpringAnimationConfig } from 'react-native/Libraries/Animated/src/animations/SpringAnimation';
import type { DecayAnimationConfig } from 'react-native/Libraries/Animated/src/animations/DecayAnimation';
import type { InterpolationConfigType } from 'react-native/Libraries/Animated/src/nodes/AnimatedInterpolation';

import type { CompositeAnimation } from './types';

/* eslint-disable no-underscore-dangle */
const arrayBased = (target, seed?: CompositeAnimation | Array<CompositeAnimation>) => {
  const res = seed ? [].concat(seed) : [];
  return {
    // $FlowFixMe
    __apply_helper__: () => target(res),

    add(anim: CompositeAnimation) {
      // $FlowFixMe
      res.push(anim.__apply_helper__ ? anim.__apply_helper__() : anim);
      return this;
    },

    // Start animation
    start: (...args: Array<any>) => target(res).start(...args),
  };
};
/* eslint-enable */

export type AnimationApi = {
  interpolate: (
    Animated.Value,
    Array<number>|Array<string>,
    input?: Array<number>,
    config?: InterpolationConfigType
  ) => Animated.Interpolation,

  spring: (
    Animated.Value | Animated.ValueXY,
    toValue: number | Animated.Value | Animated.ValueXY,
    config?: SpringAnimationConfig,
  ) => CompositeAnimation,

  timing: (
    Animated.Value | Animated.ValueXY,
    toValue: number | Animated.Value | Animated.ValueXY,
    duration?: number,
    config?: TimingAnimationConfig,
  ) => CompositeAnimation,

  decay: (
    Animated.Value | Animated.ValueXY,
    velocity: number,
    config?: DecayAnimationConfig,
  ) => CompositeAnimation,

  delay: (number) => CompositeAnimation,

  parallel: (anims?: CompositeAnimation | Array<CompositeAnimation>) => CompositeAnimation,

  sequence: (anims?: CompositeAnimation | Array<CompositeAnimation>) => CompositeAnimation,
};

const animationApi: AnimationApi = {
  interpolate: (value, output, input = [0, 1], config) => value.interpolate({
    inputRange: input,
    outputRange: output,
    ...config,
  }),

  spring: (value, toValue, config) => Animated.spring(value, {
    toValue,
    useNativeDriver: true,
    ...config,
  }),

  timing: (value, toValue, duration, config) => Animated.timing(value, {
    toValue,
    duration,
    useNativeDriver: true,
    ...config,
  }),

  decay: (value, velocity, config) => Animated.decay(value, {
    velocity,
    useNativeDriver: true,
    ...config,
  }),

  delay: (time: number) => Animated.delay(time),

  // $FlowFixMe
  parallel: anims => arrayBased(Animated.parallel, anims),

  // $FlowFixMe
  sequence: anims => arrayBased(Animated.sequence, anims),
};

export default animationApi;

