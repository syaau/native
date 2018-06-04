// @flow
import React from 'react';
import { Animated, Easing } from 'react-native';
import Navigator from '@bhoos/navigator';

function createDriver() {
  return new Animated.Value(0);
}

function createRunDriver(duration) {
  return function runDriver(driver) {
    return new Promise((resolve) => {
      Animated.timing(driver, {
        toValue: 1,
        useNativeDriver: true,
        duration,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
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
};

export default function (props: Props) {
  const { duration, ...other } = props;
  return (
    <Navigator
      {...other}
      createDriver={createDriver}
      runDriver={createRunDriver(duration || 400)}
    />
  );
}
