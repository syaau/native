// @flow
import Batch from './Batch';

class Group {
  constructor() {
    this.running = null;
    this.batches = [];
    this.lastBatch = 0;
  }

  getBatch() {
    if (this.batches.length === this.lastBatch) {
      const batch = new Batch();
      this.batches.push(batch);

      // Increase the batch in the next event cycle
      setImmediate(() => {
        // if no batches are running run the first batch
        this.lastBatch += 1;
        this.trigger();
      });

      return batch;
    }

    return this.batches[this.lastBatch];
  }

  trigger() {
    if (this.running) {
      return;
    }

    // Get a running batch
    this.running = this.batches.shift();
    this.lastBatch -= 1;

    // Start running the batch

    this.run();
  }

  run() {
    // Get all stages with the same order
    const actions = this.running.get();

    // If no stages available to run, trigger another batch
    if (actions === null) {
      // Clear the running batch
      this.running = null;

      // Trigger to get another batch
      if (this.batches.length > 0) {
        this.trigger();
      }

      return;
    }

    // Activate all the stages at once
    Promise.all(actions.map(({ stage, action, extraArgs }) => {
      if (stage.isUnmounted()) {
        return null;
      }

      return action(stage, ...extraArgs);
    })).then(() => {
      // Make an attempt to run again once all the actions are done
      this.run();
    });
  }

  queue(action, stage, extraArgs, order) {
    // Search for the stage in queued instances and remove it
    // this.batches.forEach(batch => batch.remove(stage));

    // Retrieve the last batch or a new batch
    const batch = this.getBatch();

    // include it on the batch based on the order
    batch.add({ action, stage, extraArgs }, order);
  }
}

export default Group;
