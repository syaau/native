// @flow
import Stage from './Stage';
import Animated from './AnimatedStage';
import ActionGroup from './ActionGroup';
import Attached from './Attached';
import createAction, { createActionGroup } from './Action';
import anim from './_animationApi';

// $FlowFixMe
Stage.Animated = Animated;
// $FlowFixMe
Stage.Attached = Attached;

export {
  anim,
  Stage,
  Animated,
  ActionGroup,
  Attached,
  createAction,
  createActionGroup,
};
