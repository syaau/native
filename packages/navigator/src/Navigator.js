// @flow
import React, { Component } from 'react';

type Props<Driver> = {
  routes: {[string]: Component },
  defaultRoute: string,
  createDriver: () => Driver,
  runDriver: (driver: Driver, options: {}) => Promise<*>,
};

const Context = React.createContext({});

export const { Consumer } = Context;

class Navigator extends Component<Props> {
  constructor(props) {
    super(props);

    this.listeners = [];
    this.targets = [];

    this.currentRoute = props.defaultRoute;
    this.navigator = {
      registerViewPort: this.registerViewPort,
      addListener: this.addListener,
      addTarget: this.addTarget,
      getScreen: this.getScreen,
      setRoute: this.setRoute,
      createTransition: this.createTransition,
      run: this.run,
    };
  }

  getScreen = route => this.props.routes[route];

  setRoute = (route, options) => {
    if (route !== this.currentRoute) {
      const transition = this.createTransition(route, this.currentRoute, options);
      this.currentRoute = route;

      // Run leave event on all the targets
      this.targets.forEach(target => target.onLeave && target.onLeave(transition));

      // Clear all the targets
      this.targets = [];

      // New targets are registered when the screen is updated
      this.updateScreen(transition);
    }
  }

  createTransition = (incoming, outgoing, { params, ...options } = {}) => {
    const dataSet = {};
    const completeListeners = [];

    return {
      incoming,
      params,
      options,
      outgoing,
      driver: this.props.createDriver(),
      get: id => dataSet[id],
      set: (id, data) => { dataSet[id] = data; },

      addCompleteListener: listener => completeListeners.push(listener),
      fire: result => completeListeners.forEach(l => l(result)),
    };
  }

  run = async (transition) => {
    // Trigger all transition events
    this.listeners.forEach(target => target.onTransition(transition));

    // Trigger enter events
    this.targets.forEach(target => target.onEnter && target.onEnter(transition));

    const result = await this.props.runDriver(transition.driver, transition.options);
    transition.fire(result);
  }

  addListener = (listener) => {
    this.listeners.push(listener);

    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) {
        this.listeners.splice(idx, 1);
      }
    };
  }

  addTarget = (target) => {
    this.targets.push(target);
    return () => {
      const idx = this.targets.indexOf(target);
      if (idx >= 0) {
        this.targets.splice(idx, 1);
      }
    };
  }

  registerViewPort = (updater) => {
    this.updateScreen = updater;
    return this.createTransition(this.props.defaultRoute, null);
  }

  render() {
    return (
      <Context.Provider {...this.props} value={this.navigator} />
    );
  }
}

export default Navigator;
