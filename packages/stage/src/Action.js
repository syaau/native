// @flow

import ActionGroup from './ActionGroup';
import type { StageObject } from './types';

export type ActionOptions = {
  onStart: () => void;
  onComplete: () => void;
}

export type Action = ActionOptions & {
  name: string,
  order: number,
  group: ActionGroup;
}

export function createActionGroup() {
  return new ActionGroup();
}

export default function createAction(
  group: ActionGroup,
  name: string,
  order: number,
  options: ?ActionOptions
): Action {
  return {
    ...options,
    group,
    name,
    order,
    createStage(stageOptions: StageObject): StageObject {
      return {
        action: this,
        ...stageOptions,
      };
    },
  };
}
