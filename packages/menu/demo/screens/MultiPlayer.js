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
MultiPlayer.onSelect = nav => nav.setRoute(MultiPlayer.route);

export default MultiPlayer;
