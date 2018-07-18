// @flow
import React from 'react';
import { Image } from 'react-native';

import cardImage from './images/private/card.png';
import bgImage from './images/private/bg.png';

const Private = () => (
  <Image source={bgImage} />
);

Private.route = 'private';
Private.card = cardImage;
Private.bg = bgImage;

export default Private;
