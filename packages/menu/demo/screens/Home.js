import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';

import SinglePlayer from './SinglePlayer';
import Tournament from './Tournament';
import MultiPlayer from './MultiPlayer';
import Hotspot from './Hotspot';
import Private from './Private';

import MenuCard from '../../src/MenuCard';
import calcScale from './_calcScale';
import createMenuScreen from '../../src/MenuScreen';
import { EASING_CUBIC } from '@bhoos/navigator-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const anchor = 3000;
const items = [SinglePlayer, Hotspot, MultiPlayer, Private, Tournament];
console.log(items.map((item, idx) => `${idx} - ${item.route}`).join('   '));
function calcTilt(idx) {
  const extent = 4.5;
  const interval = extent / ((items.length - 1) / 2);
  // const extent = interval * ((items.length - 1) / 2);
  const factor = extent - (Math.floor(idx / 2) * interval);
  return factor * (idx % 2 ? 1 : -1);
}

const options = {
  [Hotspot.route]: {
    duration: 600,
    easing: EASING_CUBIC,
  },
  [Tournament.route]: {
    durationg: 600,
    easing: EASING_CUBIC,
  },
};

const cards = items.map((item, idx) => (
  <MenuCard
    key={item.route}
    tilt={calcTilt(idx)}
    anchor={anchor}
    route={item.route}
    onSelect={(navigator) => {
      navigator.setRoute(item.route, options[item.route]);
    }}
    scale={calcScale(item.card, item.bg)}
  >
    <Image source={item.card} />
  </MenuCard>
));

export const screens = items.reduce((res, item, idx) => {
  console.log(idx, calcTilt(idx), item.route);
  res[item.route] = createMenuScreen(
    item,
    {
      style: styles.menuContainer,
      invScale: calcScale(item.card, item.bg),
      anchor,
      tilt: calcTilt(idx),
      dimension: Image.resolveAssetSource(item.bg),
    }
  );
  return res;
}, {});

// eslint-disable-next-line react/prefer-stateless-function
class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        {cards}
      </View>
    );
  }
}

export default Home;
