// @flow
import React from 'react';
import { Animated, Easing } from 'react-native';
import Navigator from '@bhoos/navigator';

function createDriver() {
  return new Animated.Value(0);
}

export const EASING_BEZIER = Easing.bezier(0.25, 0.46, 0.45, 0.94);
export const EASING_CUBIC = Easing.inOut(Easing.cubic);

function createRunDriver(defaultDuration = 400, defaultEasing = EASING_BEZIER) {
  return function runDriver(driver, { duration = defaultDuration, easing = defaultEasing } = {}) {
    return new Promise((resolve) => {
      Animated.timing(driver, {
        toValue: 1,
        useNativeDriver: true,
        duration,
        easing,
      }).start((result) => {
        if (!result.finished) {
          driver.setValue(1);
        }

        resolve(result);
      });
    });
  };
}

type Props = {
  duration: number,
  easing: typeof EASING_BEZIER,
};

export default function (props: Props) {
  const { duration, easing, ...other } = props;
  return (
    <Navigator
      {...other}
      createDriver={createDriver}
      runDriver={createRunDriver(duration, easing)}
    />
  );
}
