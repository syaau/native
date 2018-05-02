// @flow
import React from 'react';
import { Animated, Easing } from 'react-native';
import Navigator from '@bhoos/navigator';

function createDriver() {
  return new Animated.Value(0);
}

function runDriver(driver) {
  return new Promise((resolve) => {
    Animated.timing(driver, {
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    }).start((result) => {
      if (!result.finished) {
        driver.setValue(1);
      }

      resolve(result);
    });
  });
}

export default function (props) {
  return <Navigator {...props} createDriver={createDriver} runDriver={runDriver} />;
}
