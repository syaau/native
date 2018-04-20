import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { PLAYER_POSITIONS, PLAYER_SIZE, CARD_WIDTH, CARD_HEIGHT } from './config';
import Table from './Table';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    marginLeft: -PLAYER_SIZE / 2,
    marginTop: -PLAYER_SIZE / 2,
    borderRadius: PLAYER_SIZE / 2,
    backgroundColor: 'blue',
  },
  selected: {
    backgroundColor: 'yellow',
  },
  topBar: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  button: {
    flex: 1,
    padding: 5,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    marginLeft: -CARD_WIDTH / 2,
    marginTop: -CARD_HEIGHT / 2,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
});

function toPosition({ x, y }) {
  return {
    left: x,
    top: y,
  };
}

class TableDemo extends Component {
  state = {
    cardsInput: '',
    selectedPlayer: 0,

    starter: 0,
    cards: [],
    winner: null,
  };

  process = () => {
    const { cardsInput, selectedPlayer } = this.state;
    let winner = null;
    const cards = cardsInput.split(/\s+/).slice(0, 4).map((c, idx) => {
      if (c[0] === '*') {
        winner = idx;
        return c.substr(1);
      }
      return c;
    });

    this.setState({
      cards,
      winner,
      starter: selectedPlayer,
    });
  }

  handleChange = (text) => {
    this.setState({ cardsInput: text });
  }

  render() {
    const {
      cardsInput, winner, starter, selectedPlayer, cards,
    } = this.state;

    return (
      <View style={styles.container}>
        {[0, 1, 2, 3].map(seat => (
          <TouchableOpacity
            key={seat}
            style={[
              styles.player,
              seat === selectedPlayer ? styles.selected : null,
              toPosition(PLAYER_POSITIONS[seat]),
            ]}
            onPress={() => this.setState({ selectedPlayer: seat })}
          />
        ))}
        { <Table cards={cards} winner={winner} starter={starter} /> }
        <View style={styles.topBar}>
          <TextInput style={styles.input} value={cardsInput} onChangeText={this.handleChange} />
          <TouchableOpacity style={styles.button} onPress={this.process}>
            <Text>Process</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default TableDemo;
