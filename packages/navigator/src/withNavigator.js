import React, { Component } from 'react';
import { Consumer } from './Navigator';

export default function withNavigator(Target) {
  return class Navigateable extends Component {
    constructor(props) {
      super(props);

      this.navigator = null;
      this.unmount = null;
      this.target = null;

      this.unmounts = [];
    }

    componentDidMount() {
      if (this.target.onTransition) {
        this.unmounts.push(this.navigator.addListener(this.target));
      }

      if (this.target.onEnter || this.target.onLeave) {
        this.unmounts.push(this.navigator.addTarget(this.target));
      }
    }

    componentWillUnmount() {
      this.unmounts.forEach(u => u());
    }

    render() {
      return (
        <Consumer>
          {(navigator) => {
            this.navigator = navigator;
            return (
              <Target
                ref={(node) => { this.target = node; }}
                {...this.props}
                navigator={navigator}
              />
            );
          }}
        </Consumer>
      );
    }
  };
}
