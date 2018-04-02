// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

import type { ReactNativeStyle, StyleFn, Context } from './types';

type Props = {
  style: StyleFn | Array<ReactNativeStyle|StyleFn>,
};

const Attached = ({ style, ...other }: Props, context: Context) => {
  const animatedStyle = Array.isArray(style) ? style.map((s) => {
    if (typeof s === 'function') {
      return s(context.actionDriver);
    }
    return s;
  }) : style(context.actionDriver);

  return (
    <Animated.View style={animatedStyle} {...other} />
  );
};

Attached.contextTypes = {
  actionDriver: PropTypes.object.isRequired,
};

export default Attached;
