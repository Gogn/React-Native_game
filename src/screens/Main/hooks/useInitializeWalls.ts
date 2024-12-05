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
  'worklet';
  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  return `#${randomHex()}${randomHex()}${randomHex()}`;
};

export const useInitializeWalls = () => {
  const walls: RectInterface[] = Array(WALLS_AMOUNT)
    .fill(0)
    .map((_, i) => ({
      x: useSharedValue(0),
      y: useSharedValue(0),
      width: useSharedValue(0),
      height: useSharedValue(0),
      color: useSharedValue(0),
      i,
      ax: 0,
      ay: 0,
      canCollide: true,
      isDraggable: false,
      type: ShapeType.Rect,
      vy: useSharedValue(0),
      vx: useSharedValue(0),
      m: 0,
    }));

  const fillWallsInitials = (walls: RectInterface[]) => {
    'worklet';
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
        ? 0
        : isRightSide
        ? windowWidth - RECT_WIDTH
        : Math.random() * windowWidth;

      walls[i].x.value = x;
      walls[i].y.value = wallsYs[i];
      walls[i].width.value = RECT_WIDTH;
      walls[i].height.value = wallsHeights[i];
      walls[i].color.value = generateRandomColor();
      walls[i].vx.value = WALLS_SPEED;
      walls[i].vy.value = 0;
    }
  };

  fillWallsInitials(walls);

  return {walls, fillWallsInitials};
};
