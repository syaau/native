import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import SinglePlayer from './SinglePlayer';
import Tournament from './Tournament';
import MultiPlayer from './MultiPlayer';
import Hotspot from './Hotspot';
import Private from './Private';

import { createCards, createScreens } from '../../';

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

const items = [SinglePlayer, Hotspot, MultiPlayer, Private, Tournament];

const cards = createCards(items, 4.5, 3000);
export const screens = createScreens(items, styles.menuContainer, 4.5, 3000);

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
