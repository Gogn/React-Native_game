export const RADIUS = 50;

import {Dimensions} from 'react-native';

const {height: windowHeight, width: windowWidth} = Dimensions.get('window');

export const BALL_COLOR = '#77FF23';

export const TOTAL_BRICKS = 18;
export const BRICK_ROW_LENGTH = 3;
export const PADDLE_HEIGHT = 50;
export const PADDLE_WIDTH = 125;
export const BRICK_HEIGHT = 25;
export const BRICK_WIDTH = 80;
export const BRICK_MIDDLE = windowWidth / 2 - BRICK_WIDTH / 2;
export const PADDLE_MIDDLE = windowWidth / 2 - PADDLE_WIDTH / 2;
export const MAX_SPEED = 50;

export const height = windowHeight;
export const width = windowWidth;

export const RECT_WIDTH = 50;
export const RECT_HEIGHT = 100;
export const WALLS_SPEED = 5;
