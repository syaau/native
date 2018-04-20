// @flow
import React, { Component } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { parallel, timing } from '@bhoos/animation';
import { CENTER_POSITIONS, PLAYER_POSITIONS, CARD_WIDTH, CARD_HEIGHT } from './config';

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginLeft: -CARD_WIDTH / 2,
    marginTop: -CARD_HEIGHT / 2,
  },
});

type Props = {
  seat: number,
  card: string,
};


let count = 0;

class TableCard extends Component<Props> {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY(PLAYER_POSITIONS[this.props.seat]);
    const scale = new Animated.Value(0);

    this.position = position;
    this.scale = scale;

    this.style = {
      transform: [
        ...position.getTranslateTransform(),
        { scale },
      ],
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.card !== nextProps.card;
  }

  play() {
    console.log('Move position to ', this.position, this.props.seat, CENTER_POSITIONS[this.props.seat]);
    return parallel([
      timing(this.position, CENTER_POSITIONS[this.props.seat]),
      timing(this.scale, 1),
    ]);
  }

  finalize() {
    this.position.setValue(CENTER_POSITIONS[this.props.seat]);
    this.scale.setValue(1);
  }

  win(winner) {
    return parallel([
      timing(this.position, PLAYER_POSITIONS[winner]),
      timing(this.scale, 0),
    ]);
  }

  render() {
    count += 1;
    console.log('Rendering TableCard', count);1
    return (
      <Animated.View style={[styles.card, this.style]}>
        <Text>{this.props.card}</Text>
      </Animated.View>
    );
  }
}

export default TableCard;
