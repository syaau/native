// @flow
import React, { Component } from 'react';
import { withNavigator, createTracker } from '@bhoos/navigator-native';
import { View, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  navigator: Object,
  style: Object,
  onSelect: (navigator: Object) => void,
  tilt: number,
  anchor: number,
  route: string,
  scale: {
    x: number,
    y: number,
  },
};

class MenuCard extends Component<Props> {
  constructor(props) {
    super(props);

    this.translateY = new Animated.Value(0);
    this.tilt = new Animated.Value(0);
    this.flip = new Animated.Value(0);

    this.scaleX = new Animated.Value(1);
    this.scaleY = new Animated.Value(1);

    const rotationY = props.tilt >= 0 ? ['0deg', '360deg'] : ['360deg', '0deg'];
    const rotationZ = props.tilt >= 0 ? ['0deg', '180deg'] : ['0deg', '-180deg'];

    this.style = {
      opacity: this.flip.interpolate({
        inputRange: [0, 90, 90, 180],
        outputRange: [1, 1, 0, 0],
      }),
      transform: [
        { perspective: 1200 },
        { translateY: this.translateY },
        { translateY: props.anchor },
        {
          rotate: this.tilt.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
        { translateY: -props.anchor },
        {
          rotateY: this.flip.interpolate({
            inputRange: [0, 360],
            outputRange: rotationY,
          }),
        },
        {
          rotate: this.flip.interpolate({
            inputRange: [0, 360],
            outputRange: rotationZ,
          }),
        },
        { scaleX: this.scaleX },
        { scaleY: this.scaleY },
      ],
    };

    this.tracker = createTracker({ });
  }

  onEnter(transition) {
    if (transition.outgoing !== this.props.route) {
      this.translateY.setValue(400);
      this.tracker.track(this.translateY, transition, 0);
    } else {
      this.tilt.setValue(0);
      this.translateY.setValue(0);
      this.flip.setValue(180);

      const { scale } = this.props;
      this.scaleX.setValue(scale.x);
      this.scaleY.setValue(scale.y);
      this.tracker.track(this.scaleX, transition, 1);
      this.tracker.track(this.scaleY, transition, 1);
    }

    this.tracker.track(this.tilt, transition, this.props.tilt);
    this.tracker.track(this.flip, transition, 0);
  }

  onLeave(transition) {
    if (transition.incoming !== this.props.route) {
      this.tracker.track(this.translateY, transition, 400);
      this.tracker.track(this.tilt, transition, 0);
    } else {
      const { scale } = this.props;

      this.tracker.track(this.flip, transition, 180);
      this.tracker.track(this.scaleX, transition, scale.x);
      this.tracker.track(this.scaleY, transition, scale.y);

      this.tracker.track(this.tilt, transition, 0);
    }
  }

  render() {
    const {
      navigator, style, onSelect, tilt, route, scale, ...other
    } = this.props;

    return (
      <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
        <TouchableWithoutFeedback
          onPressIn={() => {
            onSelect(navigator);
          }}
        >
          <Animated.View
            style={[styles.container, this.style]}
            {...other}
            renderToHardwareTextureAndroid
          />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default withNavigator(MenuCard);

