// @flow

let num = 0;

class Batch {
  constructor() {
    num += 1;
    this.number = num;
    this.items = [];
    this.orders = [];
    this.markIndex = 0;
  }

  // remove(item) {
  //   for (let i = this.items.length - 1; i >= 0; i -= 1) {
  //     if (this.items[i] === item) {
  //       this.items.splice(i, 1);
  //       this.orders.splice(i, 1);
  //     }
  //   }
  // }

  add(item, order) {
    // Insert the item based on the order
    for (let i = this.orders.length - 1; i >= 0; i -= 1) {
      if (order >= this.orders[i]) {
        this.items.splice(i + 1, 0, item);
        this.orders.splice(i + 1, 0, order);
        return;
      }
    }

    this.items.unshift(item);
    this.orders.unshift(order);
  }

  get() {
    if (this.markIndex >= this.items.length) {
      return null;
    }

    const start = this.markIndex;
    const order = this.orders[start];

    do {
      this.markIndex += 1;
    } while (this.markIndex < this.orders.length && this.orders[this.markIndex] === order);

    // Return all items with the same order
    return this.items.slice(start, this.markIndex);
  }
}

export default Batch;
