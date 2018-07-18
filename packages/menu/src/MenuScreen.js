// @flow
import React, { Component } from 'react';
import { View, Animated, TouchableWithoutFeedback } from 'react-native';
import { createTracker } from '@bhoos/navigator-native';

type Props = {
  navigator: Object,
};

export default function createMenuScreen(Target, {
  style, invScale, anchor, tilt, dimension,
}) {
  return class MenuScreen extends Component<Props> {
    constructor(props) {
      super(props);

      this.scale = {
        x: 1 / invScale.x,
        y: 1 / invScale.y,
      };

      this.flip = new Animated.Value(180);
      this.scaleX = new Animated.Value(this.scale.y);
      this.scaleY = new Animated.Value(this.scale.x);

      const rotationY = tilt >= 0 ? ['0deg', '360deg'] : ['360deg', '0deg'];
      const rotationZ = tilt >= 0 ? ['180deg', '0deg'] : ['-180deg', '0deg'];

      this.tilt = new Animated.Value(tilt);
      this.style = {
        opacity: this.flip.interpolate({
          inputRange: [0, 90, 90, 180, 270, 270, 360],
          outputRange: [1, 1, 0, 0, 0, 1, 1],
        }),
        transform: [
          { perspective: 1200 },
          { translateY: anchor },
          {
            rotate: this.tilt.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
          { translateY: -anchor },
          {
            rotateY: this.flip.interpolate({
              inputRange: [0, 360],
              outputRange: rotationY,
            }),
          },
          {
            rotate: this.flip.interpolate({
              inputRange: [0, 360],
              outputRange: rotationZ, // ['180deg', '0deg'],
            }),
          },
          { scaleX: this.scaleX },
          { scaleY: this.scaleY },
        ],
      };

      this.tracker = createTracker({ });
    }

    onEnter(transition) {
      this.tracker
        .track(this.flip, transition, 360)
        .track(this.scaleX, transition, 1)
        .track(this.scaleY, transition, 1)
        .track(this.tilt, transition, 0);
    }

    onLeave(transition) {
      this.tracker
        .track(this.flip, transition, 180)
        .track(this.scaleX, transition, this.scale.y)
        .track(this.scaleY, transition, this.scale.x)
        .track(this.tilt, transition, tilt);
    }

    render() {
      return (
        <Animated.View style={[style, this.style]} renderToHardwareTextureAndroid>
          <Target />
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableWithoutFeedback onPressIn={() => this.props.navigator.setRoute('home')}>
              <View
                style={{
                  position: 'absolute',
                  left: (dimension.width / 2) - 20,
                  top: -dimension.height - 20,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'green',
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      );
    }
  };
}

