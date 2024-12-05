import {Dimensions, Platform} from 'react-native';
export const {height: windowHeight, width: windowWidth} =
  Dimensions.get('window');

const fontFamily = Platform.select({ios: 'Helvetica', default: 'serif'});
export const fontStyleBig = {
  fontFamily,
  fontSize: 48,
};
export const fontStyleMedium = {
  fontFamily,
  fontSize: 24,
};
export const fontStyleSmall = {
  fontFamily,
  fontSize: 16,
};

export const RADIUS = 25;
export const RECT_WIDTH = 25;
export const RECT_HEIGHT = 200;
export const WALLS_AMOUNT = 5;
export const WALLS_SPEED = 20;

export const PLAYER_SPEED_REDUCE = -0.2;
