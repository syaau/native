// @flow
/* eslint-disable camelcase, no-underscore-dangle */
import { Component } from 'react';
import type { Node } from 'react';
import Group from './Group';
import shallowEqual from './shallowEqual';
import stateChanged from './stateChanged';

const defaultGroup = new Group();

type StageOperation = {
  queue: (
    order: number,
    action: (StageOperation) => void | Promise<void>,
    extraArgs: Object
  ) => void,
  set: (updater: Object) => Promise<void>,
};

type Props = {
  params: Object,

  prepare: (StageOperation) => void,

  // eslint-disable-next-line react/no-unused-prop-types, Used in getDerivedStateFromProps
  onChange: (StageOperation) => void,

  // eslint-disable-next-line react/no-unused-prop-types, Used in helper method
  group: Group,

  children: (stage: Object) => Node,
};

class Stage extends Component<Props, {}> {
  static defaultProps = {
    group: defaultGroup,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { __proxy__ } = prevState;
    const currentParams = __proxy__.getCurrentParams();

    // Only if params have changed
    if (!shallowEqual(nextProps.params, currentParams)) {
      return nextProps.onChange(__proxy__, nextProps.params, currentParams);
    }

    return null;
  }

  constructor(props) {
    super(props);

    // List of resolvers waiting for update
    this.updateResolvers = [];
    this.unmounted = false;

    const proxy = {
      getCurrentParams: () => this.props.params,

      isUnmounted: () => this.unmounted,

      queue: (order, action, ...extraArgs) => {
        this.props.group.queue(action, proxy, extraArgs, order);
      },

      set: stage => new Promise((resolve) => {
        // Can't set if the component is already unmounted
        if (this.unmounted) {
          resolve(false);
          return;
        }

        // Check for changes in state, if not found, then no need to
        // wait for update
        if (!stateChanged(stage, this.state)) {
          console.log('Resolving right away since no change in stage detected', stage, this.state);
          resolve(true);
          return;
        }

        // Resolve later on update
        this.updateResolvers.push(resolve);

        // Change state
        this.setState(stage);
      }),
    };

    const stage = (props.prepare && props.prepare(proxy, props.params)) || props.params;
    this.state = {
      ...stage,
      __proxy__: proxy,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only update if the state has changed
    return !shallowEqual(nextState, this.state);
  }

  componentDidUpdate() {
    this.resolveAll(true);
  }

  componentWillUnmount() {
    this.unmounted = true;
    // Resolve all updates
    this.resolveAll(false);
  }

  resolveAll(result) {
    const all = this.updateResolvers;
    this.updateResolvers = [];
    all.forEach(r => r(result));
  }

  unmounted = false;

  render() {
    const { children } = this.props;
    return children(this.state);
  }
}

export default Stage;
