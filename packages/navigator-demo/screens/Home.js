// @flow
import React, { Component } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { HeroIcon, createTracker } from '@bhoos/navigator-native';

const iron = require('../assets/iron-man.png');
const thor = require('../assets/thor.png');
const hulk = require('../assets/hulk.png');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    width: 60,
    height: 90,
  },
});

const animateTo = (tracker, transition, { x, y }) => (
  tracker.move(transition, 30 - x, 30 - y)
);

class Home extends Component {
  constructor(props) {
    super(props);

    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(0.01);
    this.style = {
      opacity,
      transform: [
        { scale },
      ],
    };

    this.tracker = createTracker({ opacity, scale });
  }

  onEnter(transition) {
    this.tracker.fadeIn(transition).zoomIn(transition);
  }

  onLeave(transition) {
    this.tracker.fadeOut(transition).zoomOut(transition);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <HeroIcon id="iron" link style={styles.button} source={iron} animateTo={animateTo} />
          <HeroIcon id="thor" link style={styles.button} source={thor} animateTo={animateTo} />
          <HeroIcon id="hulk" link style={styles.button} source={hulk} animateTo={animateTo} />
        </View>
      </View>
    );
  }
}

export default Home;
