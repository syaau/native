import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import cardImage from './images/singleplayer/card.png';
import bgImage from './images/singleplayer/bg.png';

const dimension = Image.resolveAssetSource(bgImage);

const SinglePlayer = () => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Image source={bgImage} />
    <TouchableOpacity
      title="Play"
      onPress={() => {}}
      style={{
        position: 'absolute',
        width: 60,
        height: 40,
        backgroundColor: 'red',
        top: dimension.height,
      }}
    />
  </View>
);

SinglePlayer.route = 'sp';
SinglePlayer.card = cardImage;
SinglePlayer.bg = bgImage;

export default SinglePlayer;
