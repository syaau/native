// @flow
/* global requestAnimationFrame */
import React, { Component } from 'react';
import { Animated, View } from 'react-native';
import { withNavigator } from '@bhoos/navigator';
import createTracker from './createTracker';

type Props = {
  id: string,
  link: boolean,
  animateTo: () => void,
  style: Object,
}

const enterAnimation = (tracker, transition) => tracker.fadeIn(transition).zoomIn(transition);
const leaveAnimation = (tracker, transition) => tracker.fadeOut(transition).zoomOut(transition);

class HeroIcon extends Component<Props> {
  constructor(props) {
    super(props);

    if (props.link) {
      const scale = new Animated.Value(0.01);
      const translateX = new Animated.Value(0);
      const translateY = new Animated.Value(0);
      const opacity = new Animated.Value(0);
      this.style = {
        width: '100%',
        height: '100%',
        opacity,
        transform: [
          { translateX },
          { translateY },
          { scale },
        ],
      };
      this.tracker = createTracker({ scale, opacity, translateX, translateY });
    } else {
      this.style = props.style;
    }

    if (props.link) {
      this.touchHandler = {
        onStartShouldSetResponder: () => true,
        onResponderRelease: () => {
          props.navigator.setRoute(props.id);
        },
      };
    } else {
      this.touchHandler = {};
    }
  }

  onEnter = (transition) => {
    const { id, link } = this.props;
    if (transition.incoming === id) {
      if (!link) {
        this.node.setNativeProps({ opacity: 0 });
        transition.addCompleteListener(() => this.node.setNativeProps({ opacity: 1 }));
      }
    } else if (link) {
      // Do the generic animation
      enterAnimation(this.tracker, transition);
    }
  }

  onLeave = (transition) => {
    const { id, link, animateTo } = this.props;
    if (transition.incoming === id) {
      if (link) {
        requestAnimationFrame(() => {
          this.node.measure((rx, ry, width, height, x, y) => {
            animateTo(this.tracker, transition, {
              x, y, width, height, rx, ry,
            });
          });
        });
        // Perform a specific animation
        // animateTo(this.tracker, transition);
      }
    } else if (link) {
      // Do the generic animation
      leaveAnimation(this.tracker, transition);
    }
  }

  render() {
    const {
      id, link, style, animateTo, ...other
    } = this.props;
    return (
      <View style={style} ref={(node) => { this.node = node; }} {...this.touchHandler} >
        <Animated.Image style={this.style} {...other} resizeMode="contain" />
      </View>
    );
  }
}

export default withNavigator(HeroIcon);
