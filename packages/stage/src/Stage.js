/**
 * @flow
 */
import { Component } from 'react';
import PropTypes from 'prop-types';

import { createStage } from './Instance';
import type { BasicStage } from './Instance';
import type { ActionProps, Context } from './types';

import debug from './_debug';

type State<Props: ActionProps> = {
  stage: BasicStage<Props>,
  finalStage: BasicStage<Props>,
};

class Stage<Props: ActionProps> extends Component<Props, State<Props>> {
  /* eslint-disable react/sort-comp */
  unmounted: boolean;
  /* eslint-enable */

  constructor(props: Props, context: Context) {
    super(props, context);

    const stage = createStage(this, props, context);
    this.state = {
      // Always update the stage via the queue, otherwise we will
      // not be able to control the sequence
      finalStage: stage,
      stage,
    };
  }

  getChildContext() {
    return {
      actionDriver: this.state.stage && this.state.stage.driver,
    };
  }

  componentDidMount() {
    // Queue the first stage
    // eslint-disable-next-line no-unused-expressions
    debug && debug(`ActionView::Queuing Stage ${this.state.stage.getName()} on mount`);
    this.state.stage.queue();
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (this.state.finalStage.stage !== nextProps.stage) {
      const newStage = createStage(this, nextProps, nextContext);
      const { stage, finalStage } = this.state;
      if (stage === finalStage && stage.isComplete) {
        if (!stage.hide) {
          this.setState({
            stage: newStage,
            finalStage: newStage,
          });
        } else {
          // Do not update the state right away, there might be a hide animation
          // to show before updating
          // eslint-disable-next-line no-unused-expressions
          debug && debug(`ActionView::Queing defered Stage ${newStage.getName()} on update`);
          newStage.queue();
        }
      } else {
        this.setState({
          finalStage: newStage,
        });
      }
    } else {
      this.state.finalStage.update(nextProps, nextContext);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State<Props>) {
    // If we have just changed the state, or the stage was changed
    // then we need to update
    if (this.state.stage !== nextState.stage) {
      return true;
    }

    // If the updates are for future, then don't update
    if (nextState.stage !== nextState.finalStage) {
      return false;
    }

    // If on the same stage, let the stage decide
    const updateAnim = nextState.stage.shouldUpdate();
    if (updateAnim === true) {
      return true;
    } else if (updateAnim) {
      updateAnim.start();
    }

    return false;
  }

  componentDidUpdate(prevProps: Props, prevState: State<Props>) {
    if (this.state.stage !== prevState.stage) {
      if (!prevState.stage.hide) {
        // eslint-disable-next-line no-unused-expressions
        debug && debug(`ActionView::Queuing stage to run ${this.state.stage.getName()} on Update`);
        this.state.stage.queue();
      }
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-unused-expressions
    debug && debug(`ActionView::Unmounting component with ${this.state.stage.getName()}`);
    this.unmounted = true;
  }

  render() {
    const { stage } = this.state;
    if (stage === null) {
      return null;
    }

    return stage.other.children;
  }
}

Stage.childContextTypes = {
  actionDriver: PropTypes.object,
};

Stage.contextTypes = {
  actionDriver: PropTypes.object,
};

export default Stage;
