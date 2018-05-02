import React, { Component } from 'react';
import { Consumer } from './Navigator';
import Screen from './Screen';

class ViewPort extends Component {
  constructor(props) {
    super(props);
    this.screen = null;
  }

  attachScreen = (node) => {
    this.screen = node;
  }

  update = (transition) => {
    this.screen.update(transition);
  }

  render() {
    return (
      <Consumer>
        {(navigator) => {
          const initialTransition = navigator.registerViewPort(this.update);
          return (
            <Screen
              ref={this.attachScreen}
              navigator={navigator}
              initialTransition={initialTransition}
            />
          );
        }}
      </Consumer>
    );
  }
}

export default ViewPort;
