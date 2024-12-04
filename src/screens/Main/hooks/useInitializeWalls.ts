import {
  RECT_HEIGHT,
  RECT_WIDTH,
  WALLS_AMOUNT,
  WALLS_SPEED,
  windowWidth,
} from '../constants.ts';
import {useSharedValue} from 'react-native-reanimated';
import {RectInterface, ShapeType} from '../types.ts';

const generateRandomColor = () => {
  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  return `#${randomHex()}${randomHex()}${randomHex()}`;
};

export const useInitializeWalls = () => {
  const walls: RectInterface[] = Array(WALLS_AMOUNT).fill(0);

  const calcWallHeight = RECT_HEIGHT * (Math.random() * 5);

  const wallsHeights = Array(WALLS_AMOUNT)
    .fill(0)
    .map(() => calcWallHeight);
  const wallsYs = Array(WALLS_AMOUNT);
  wallsYs[0] = -wallsHeights[0];
  for (let i = 1; i < wallsYs.length; i++) {
    // Make walls one after another on Y. + overlapping.
    wallsYs[i] = wallsYs[i - 1] - wallsHeights[i] + 50;
  }

  for (let i = 0; i < WALLS_AMOUNT; i++) {
    const placing = Math.random();
    const isLeftSide = placing < 0.3;
    const isRightSide = placing > 0.7;

    const x = isLeftSide
      ? useSharedValue(0)
      : isRightSide
      ? useSharedValue(windowWidth - RECT_WIDTH)
      : useSharedValue(Math.random() * windowWidth);
    walls[i] = {
      x,
      y: useSharedValue(wallsYs[i]),
      width: useSharedValue(RECT_WIDTH),
      height: useSharedValue(wallsHeights[i]),
      color: useSharedValue(generateRandomColor()),
      i,
      ax: 0,
      ay: 0,
      canCollide: true,
      isDraggable: false,
      type: ShapeType.Rect,
      vy: useSharedValue(0),
      vx: useSharedValue(WALLS_SPEED),
      m: 0,
    };
  }

  return walls;
};
