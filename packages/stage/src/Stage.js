// @flow
/* eslint-disable camelcase, no-underscore-dangle */
import { Component } from 'react';
import type { Node } from 'react';
import Group from './Group';
import shallowEqual from './shallowEqual';

const defaultGroup = new Group();

function stageOnUpdate(stage, { group, params }) {
  return {
    queue: (order, action, extraArgs) => group.queue(action, stage, params, extraArgs, order),
    set: updater => new Promise(resolve => stage.updateState(updater, resolve)),
  };
}

function stageOnCreate(stage, { group, params }) {
  return {
    queue: (order, action, extraArgs) => group.queue(action, stage, params, extraArgs, order),
    set: updater => new Promise(resolve => stage.updateState(updater, resolve)),
  };
}

type StageOperation = {
  queue: (order: number, action: Object | (StageOperation) => void | Promise<void>, extraArgs: Object) => void,
  set: (updater: Object) => Promise<void>,
};

type Props<T> = {
  params: Object,
  prepare: (StageOperation) => void,
  onChange: (StageOperation) => void,

  // eslint-disable-next-line react/no-unused-prop-types, Used in helper method
  group: Group,
  children: (stage:T) => Node,
};

class Stage extends Component<Props, {}> {
  static defaultProps = {
    group: defaultGroup,
  };

  constructor(props) {
    super(props);

    this.updateResolvers = [];

    // Start with an empty state
    this.state = {};
    this.unmounted = false;

    // Update stages for the first time
    if (props.prepare) {
      const updateState = props.prepare(stageOnCreate(this, props), props.params);
      this.state = {
        ...props.params,
        ...updateState,
      };
    } else {
      this.state = props.params;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Update the stage when the params change
    if (nextProps.params !== this.props.params) {
      nextProps.onChange(
        stageOnUpdate(this, nextProps),
        nextProps.params,
        this.props.params
      );
    }

    // Only update if the state has changed
    const update = !shallowEqual(nextState, this.state);
    if (!update) {
      console.log('Resolving without update', nextState, this.states);
      this.resolveAll(true);
    }
    return update;
  }

  componentDidUpdate() {
    this.resolveAll(true);
  }

  componentWillUnmount() {
    this.unmounted = true;
    // Resolve all updates
    this.resolveAll(false);
  }

  updateState(updater, resolve) {
    if (this.unmounted) {
      resolve(false);
      return;
    }

    console.log('Updating State to ', updater);
    this.updateResolvers.push(resolve);
    this.setState(updater);
  }

  resolveAll(result) {
    const all = this.updateResolvers;
    this.updateResolvers = [];
    all.forEach(r => r(result));
  }

  execute(action, params, extraArgs) {
    console.log('Executing action', action);
    // Do not execute action on an already unmounted component
    if (this.unmounted) {
      return null;
    }

    return action(stageOnUpdate(this, this.props), params, extraArgs);
  }

  unmounted = false;

  render() {
    console.log('Rendering Stage');
    const { children } = this.props;
    return children(this.state);
  }
}

export default Stage;
