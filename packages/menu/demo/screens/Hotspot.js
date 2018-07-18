// @flow
import React from 'react';
import { Image } from 'react-native';
import { EASING_CUBIC } from '@bhoos/navigator-native';

import cardImage from './images/hotspot/card.png';
import bgImage from './images/hotspot/bg.png';

const Hotspot = () => (
  <Image source={bgImage} />
);

Hotspot.route = 'hotspot';
Hotspot.card = cardImage;
Hotspot.bg = bgImage;
Hotspot.onSelect = nav => nav.setRoute(Hotspot.route, {
  duration: 1000,
  easing: EASING_CUBIC,
});

export default Hotspot;
