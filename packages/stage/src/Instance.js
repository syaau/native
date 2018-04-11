/**
 * @flow
 */
import type Stage from './Stage';

import type { ActionProps, Context, StageObject, Driver, Style } from './types';
import type { Action } from './Action';

import debug from './_debug';
import animationApi from './_animationApi';

export class BasicStage<T: ActionProps> {
  instance: Stage<T>;
  driver: Driver;
  style: ?Style;
  prevParams: ?Object;
  params: ?Object;
  other: Object;
  isComplete: boolean;
  hide: boolean;

  constructor(instance: Stage<T>, props: ActionProps, context: Context) {
    this.instance = instance;
    this.isComplete = false;
    this.hide = false;
    this.update(props, context);
  }

  // eslint-disable-next-line class-methods-use-this
  getName() {
    return 'Proxy Stage for null';
  }

  update(props: ActionProps, context: Context) {
    const {
      stage, driver, params, ...other
    } = props;
    this.driver = {
      ...context.actionDriver,
      ...driver,
    };

    this.prevParams = this.params;
    this.params = params;
    this.other = other;
  }

  // eslint-disable-next-line class-methods-use-this
  queue() {
    this.isComplete = true;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  activate(callback: () => void) {
    throw new Error('BasicStage cannot be activated');
  }

  // eslint-disable-next-line class-methods-use-this
  shouldUpdate() {
    return true;
  }
}

export default class InstanceStage<T:ActionProps> extends BasicStage<T> {
  stage: StageObject;
  action: Action;

  constructor(
    instance: Stage<T>,
    stage: StageObject,
    props: ActionProps,
    context: Context
  ) {
    super(instance, props, context);

    this.stage = stage;
    this.action = stage.action;
    this.hide = !!this.stage.animateOut;
  }

  getName() {
    return this.stage.action.name;
  }

  shouldUpdate() {
    if (!this.stage.shouldUpdate) {
      return false;
    }

    return this.stage.shouldUpdate(this.params, this.prevParams, animationApi, this.driver);
  }

  onStart() {
    if (this.stage.onStart && !this.instance.unmounted) {
      // $FlowFixMe using generic
      this.stage.onStart(this.params);
    }
  }

  onComplete() {
    this.isComplete = true;

    if (this.stage.onComplete && !this.instance.unmounted) {
      this.stage.onComplete(this.params);
    }

    // If there are any stage to apply to the instance do it now
    if (this.instance.state.finalStage !== this) {
      // eslint-disable-next-line no-unused-expressions
      debug && debug(`ActionView::Updating Final Stage ${this.instance.state.finalStage.getName()} to update`);
      this.instance.setState({
        stage: this.instance.state.finalStage,
      });
      // this.instance.state.finalStage.queue();
    }
  }

  activate(callback: () => void) {
    // When the stage is activated, check if the hide animation needs to be run for previous
    // stage
    const { stage } = this.instance.state;
    if (stage !== this) {
      // We got ourselves a deferred stage
      // $FlowFixMe condition only when hide flag is set, which can't happen with BasicStage
      const hideAnimation = stage.stage.animateOut;
      if (hideAnimation !== true) {
        const anim = hideAnimation(animationApi, stage.driver, stage.params, this.params);
        anim.start(() => this.show(callback));
      } else {
        this.show(callback);
      }
    } else {
      this.show(callback);
    }
  }

  show(callback: () => void) {
    if (this.instance.unmounted) {
      callback();
      return;
    }

    const { stage, finalStage } = this.instance.state;
    if (stage !== this) {
      this.instance.setState({
        stage: this,
        finalStage: stage === finalStage ? this : finalStage,
      });
    }

    // eslint-disable-next-line no-unused-expressions
    debug && debug(`ActionView::Activating Stage ${this.getName()}`);
    // Start the animation as soon as the stage has been activated
    if (!this.stage.animate) {
      this.finish(true, callback);
    } else {
      const anim = this.stage.animate(animationApi, this.driver, this.params);
      // If no animation is returned for running
      if (anim === null) {
        this.finish(true, callback);
      } else if (this.stage.unbound) {
        // If the stage is not bound
        // Just trigger the animation and move on to the next
        try {
          anim.start(({ finished }) => this.finish(finished));
        } catch (err) {
          console.error(`Error running animation for ${this.getName()}`, err);
        }
        callback();
      } else {
        try {
          anim.start(({ finished }) => this.finish(finished, callback));
        } catch (err) {
          console.error(`Error running animation fro ${this.getName()}`, err);
        }
      }
    }
  }

  finish(finished: boolean, callback?: () => void) {
    // eslint-disable-next-line no-unused-expressions
    debug && debug(`ActionView::Finishing Stage ${this.getName()} - finished: ${finished ? 'COMPLETE' : 'INCOMPLETE'}`);

    if (this.stage.forward) {
      try {
        this.stage.forward(this.driver, this.params);
      } catch (err) {
        console.error(`Error forwarding stage ${this.getName()}`, err);
      }
    }

    // Finally trigger the queue manager to run next stage on queue
    if (callback) {
      callback();
    }
  }

  queue() {
    // The instance is queued for activation, set to initial value
    // if available
    if (this.stage.setInitialValue) {
      this.stage.setInitialValue(this.driver, this.params);
    }
    this.action.group.queue(this);
  }
}

export function createStage<T: ActionProps>(
  instance: Stage<T>,
  props: ActionProps,
  context: Context
): BasicStage<T> {
  if (props.stage) {
    return new InstanceStage(instance, props.stage, props, context);
  }

  return new BasicStage(instance, props, context);
}
