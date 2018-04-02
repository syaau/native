/**
 * Group action instances.
 *
 * Whenever a new action stage is passed to a component, a new
 * instance is created, which is not rendered directly but
 * rather queued on this Group to make sure the actions are
 * rendered in sequence
 *
 * @flow
 */
import type InstanceStage from './Instance';
import type { ActionProps } from './types';

class ActionGroup {
  // qCache: Array<InstanceStage<*>> | null;
  // q: Array<InstanceStage<*>>;
  // Batches that are ready to be run
  batches: Array<Array<InstanceStage<*>>>;

  // The current batch being created
  currentBatch: null | Array<InstanceStage<*>>;

  // The current running batch
  runningBatch: Array<InstanceStage<*>>;

  running: null| Array<InstanceStage<*>>;

  constructor() {
    this.batches = [];
    this.currentBatch = null;
    this.runningBatch = [];
    this.running = null;
  }

  getCurrentBatch(): Array<InstanceStage<*>> {
    if (!this.currentBatch) {
      // Create a new batch
      this.currentBatch = [];
      this.batches.push(this.currentBatch);

      // Queue the batch in next event loop
      setImmediate(() => {
        this.currentBatch = null;
        // If no running batch is available trigger the running
        if (!this.running) {
          this.trigger();
        }
      });
    }

    // $FlowFixMe Current Batch is set to empty array
    return this.currentBatch;
  }

  queue<T:ActionProps>(stage: InstanceStage<T>) {
    const currentBatch = this.getCurrentBatch();

    // Include stages into the current Batch in proper order
    let i = currentBatch.length;
    while (i > 0) {
      const prev = currentBatch[i - 1];
      // Check based on the order, Also keep the same
      // stage object together
      if (stage.action === prev.action || stage.action.order > prev.action.order) {
        break;
      }
      i -= 1;
    }

    // $FlowFixMe This hsould not have been an error, Flow Generics has some issue.
    currentBatch.splice(i, 0, stage);
  }

  getStagesToRun(): Array<InstanceStage<*>> | null {
    if (this.running) {
      return null;
    }

    // Always get from the running batch
    if (this.runningBatch.length > 0) {
      const batch = this.runningBatch;
      const first = batch.shift();
      const res = [first];
      while (batch.length > 0 && batch[0].action === first.action) {
        res.push(batch.shift());
      }

      // Since we are ready to run a batch, its always going to be on
      // a single action, so send a callback
      if (first.action.onStart) {
        first.action.onStart();
      }

      res.forEach(r => r.onStart());
      return res;
    }

    // If there are batches available to run, setup trigger to run
    // on the next event cycle
    if (this.batches.length > 0) {
      this.runningBatch = this.batches.shift();
      setImmediate(() => this.trigger());
    }

    return null;
  }

  trigger() {
    const stages = this.getStagesToRun();
    if (stages === null) {
      return;
    }

    this.running = stages;

    let count = 0;
    // $FlowFixMe A running instance stage always has a stage
    stages.forEach(stage => stage.activate(() => {
      count += 1;
      if (count === stages.length) {
        if (stages[0].action.onComplete) {
          stages[0].action.onComplete();
        }
        stages.forEach(s => s.onComplete());
        this.running = null;
        this.trigger();
      }
    }));
  }
}

export default ActionGroup;
