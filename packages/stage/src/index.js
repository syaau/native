// @flow
import Stage from './Stage';
import Animated from './AnimatedStage';
import ActionGroup from './ActionGroup';
import Attached from './Attached';
import createAction, { createActionGroup } from './Action';
import anim from './_animationApi';

// $FlowFixMe
Stage.Animated = Animated;
Stage.View = Stage.Animated;

// $FlowFixMe
Stage.Attached = Attached;
Stage.AttachedView = Attached;

export {
  anim,
  Stage,
  Animated,
  ActionGroup,
  Attached,
  createAction,
  createActionGroup,
};
