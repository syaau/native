import React, { Component } from 'react';
import Stage from '@bhoos/stage';
import { run, parallel, sequence, delay } from '@bhoos/animation';

import TableCard from './TableCard';

const Play = index => 9 + (index / 10);
const Win = 10;

function toSeat(index) {
  return index;
}

class Table extends Component {
  constructor(props) {
    super(props);

    this.nodes = {};
  }

  onPlay = async ({ set }, cards, card, userCard) => {
    // await set({ cards });
    await set({ cards });

    // If this card was played by the user, then no need to
    // animate
    const node = this.nodes[card];
    if (userCard !== card) {
      // Trigger play animation
      await run(node.play());
    }

    // make sure the cards are at the right position, just in case the
    // animation didn't finish, or if it were the user card
    node.finalize();
  }

  onWin = async ({ set }, winner) => {
    await set({ winner });

    console.log('Winning with', winner);
    await run(sequence([
      delay(1000),
      parallel(Object.keys(this.nodes).map(c => this.nodes[c].win(winner))),
    ]));
  }

  registerNode(card, node) {
    if (node === null) {
      delete this.nodes[card];
    } else {
      this.nodes[card] = node;
    }
  }

  prepare = ({ queue }, { cards, winner }) => {
    // Run animation if no winner has been set
    if (!winner) {
      cards.forEach((card, idx) => queue(Play(idx), this.onPlay, card));
    }
  }

  updateStage = ({ queue }, { cards, winner }, prevParams) => {
    if (cards !== prevParams.cards) {
      for (let i = 0; i < cards.length; i += 1) {
        if (cards[i] !== prevParams.cards[i]) {
          queue(Play(i), this.onPlay, cards, cards[i]);
        }
      }

      if (winner) {
        queue(Win, this.onWin, winner);
      }
    }

    return null;
  }

  renderStage = ({ cards, winner, starter }) => {
    console.log('Rendering Stage with', cards, winner, starter);
    const tableCards = cards.map((card, index) => {
      if (card === null) {
        return null;
      }

      // Get seat index for the given cards array
      const seat = toSeat(starter + index);

      return (
        <TableCard
          ref={node => this.registerNode(card, node)}
          key={card}
          seat={seat}
          card={card}
        />
      );
    });

    // if a winner is declared, then move the winning card
    // to the end of the array
    if (winner) {
      const winningIndex = ((winner - starter) + 4) % 4;
      tableCards.push(tableCards.splice(winningIndex, 1)[0]);
    }

    return tableCards;
  }

  render() {
    return (
      <Stage params={this.props} prepare={this.prepare} onChange={this.updateStage}>
        {this.renderStage}
      </Stage>
    );
  }
}

export default Table;
