// @flow
import React from 'react';
import { Animated } from 'react-native';

import Stage from './Stage';
import type { ActionProps, Context, Style } from './types';

function processStyle(style, driver) {
  if (Array.isArray(style)) {
    return style.map(s => processStyle(s, driver));
  }

  if (typeof style === 'function') {
    return style(driver);
  }

  return style;
}

type Props = ActionProps & {
  style?: Style;
};

const AnimatedStage = ({
  driver, params, stage, style, ...other
}: Props, { actionDriver }: Context) => (
  <Stage driver={driver} params={params} stage={stage}>
    <Animated.View style={processStyle(style, { ...actionDriver, ...driver })} {...other} />
  </Stage>
);

AnimatedStage.contextTypes = Stage.contextTypes;

export default AnimatedStage;

