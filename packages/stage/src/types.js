// @flow
import { Animated } from 'react-native';
import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type { Action } from './Action';
import type { AnimationApi } from './_animationApi';

type AnimatedValue = Animated.Value | Animated.ValueXY;

export type Driver = {
  [string]: AnimatedValue | Array<AnimatedValue> | Driver,
};

export type ReactNativeStyle = StyleObj;
export type StyleFn = (Driver) => StyleObj;
export type AnimatedStyle = StyleObj | (Driver) => StyleObj;

export type Style = AnimatedStyle | Array<AnimatedStyle>;
export type EndResult = { finished: boolean };
export type EndCallback = (result: EndResult) => void;

export type CompositeAnimation = {
  start: (callback?: ?EndCallback) => void,
  stop: () => void,
  reset: () => void,
};

export type StageObject = {
  setInitialValue?: (drivers: Driver, params: ?Object) => void;
  animate?: (anim: AnimationApi, drivers: Driver, params: ?Object) => CompositeAnimation;
  animateOut? : true | (
    anim: AnimationApi,
    drivers: Driver,
    params: ?Object,
    newParams: ?Object
  ) => CompositeAnimation;
  forward?: (drivers: Driver, params: ?Object) => void;

  onStart?: (params: ?Object) => void;
  onComplete?: (params: ?Object) => void;

  action: Action;

  shouldUpdate?: (
    params: ?Object,
    prevParams: ?Object,
    anim: AnimationApi,
    drivers: Driver
  ) => boolean;

  unbound?: boolean;
};

export type ActionProps = {
  driver?: Driver,
  stage?: StageObject | null,
  params?: Object,
  children?: *,
};

export type Context = {
  actionDriver: Driver,
};

