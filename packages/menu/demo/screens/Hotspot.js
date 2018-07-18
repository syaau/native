// @flow
import React from 'react';
import { Image } from 'react-native';

import cardImage from './images/hotspot/card.png';
import bgImage from './images/hotspot/bg.png';

const Hotspot = () => (
  <Image source={bgImage} />
);

Hotspot.route = 'hotspot';
Hotspot.card = cardImage;
Hotspot.bg = bgImage;

export default Hotspot;
