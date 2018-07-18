import React from 'react';
import { Image } from 'react-native';

import cardImage from './images/tournament/card.png';
import bgImage from './images/tournament/bg.png';

const Tournament = () => (
  <Image source={bgImage} />
);

Tournament.route = 'tour';
Tournament.card = cardImage;
Tournament.bg = bgImage;
Tournament.onSelect = nav => nav.setRoute(Tournament.route);

export default Tournament;

