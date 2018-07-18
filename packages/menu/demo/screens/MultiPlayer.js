// @flow
import React from 'react';
import { Image } from 'react-native';

import cardImage from './images/multiplayer/card.png';
import bgImage from './images/multiplayer/bg.png';

const MultiPlayer = () => (
  <Image source={bgImage} />
);

MultiPlayer.route = 'mp';
MultiPlayer.card = cardImage;
MultiPlayer.bg = bgImage;

export default MultiPlayer;
