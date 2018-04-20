import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');

export const WIDTH = width;
export const HEIGHT = height;

const HALF_WIDTH = width / 2;
const HALF_HEIGHT = height / 2;

export const PLAYER_SIZE = 80;
const HALF_PLAYER_SIZE = PLAYER_SIZE / 2;

export const CARD_WIDTH = 64;
export const CARD_HEIGHT = 90;

export const PLAYER_POSITIONS = [
  { x: HALF_WIDTH, y: height - HALF_PLAYER_SIZE },
  { x: width - HALF_PLAYER_SIZE, y: HALF_HEIGHT },
  { x: HALF_WIDTH, y: HALF_PLAYER_SIZE },
  { x: HALF_PLAYER_SIZE, y: HALF_HEIGHT },
];

export const CENTER_POSITIONS = [
  { x: HALF_WIDTH, y: HALF_HEIGHT + (CARD_HEIGHT * 0.6) },
  { x: HALF_WIDTH + (CARD_WIDTH * 1.2), y: HALF_HEIGHT },
  { x: HALF_WIDTH, y: HALF_HEIGHT - (CARD_HEIGHT * 0.6) },
  { x: HALF_WIDTH - (CARD_WIDTH * 1.2), y: HALF_HEIGHT },
];
