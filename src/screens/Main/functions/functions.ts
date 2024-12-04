import {
  Collision,
  PlayerCircleInterface,
  LineInterface,
  RectInterface,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {RECT_HEIGHT, windowHeight, windowWidth} from '../constants.ts';
import {
  checkCollisionCircleRect,
  resolveCollisionWithWall,
  resolveWallCollision,
} from './collisions.ts';
import {FrameInfo, runOnJS} from 'react-native-reanimated';
import {vec} from '@shopify/react-native-skia';

const move = (object: ShapeInterface, dt: number) => {
  'worklet';
  if (object.type === ShapeType.Circle) {
    // object.vx += object.ax * dt;
    // object.vy += object.ay * dt;
    // if (object.vx > MAX_SPEED) {
    //   object.vx = MAX_SPEED;
    // }
    // if (object.vx < -MAX_SPEED) {
    //   object.vx = -MAX_SPEED;
    // }
    // if (object.vy > MAX_SPEED) {
    //   object.vy = MAX_SPEED;
    // }
    // if (object.vy < -MAX_SPEED) {
    //   object.vy = -MAX_SPEED;
    // }
    object.x.value += object.vx.value * dt;
    object.y.value += object.vy.value * dt;
  }
  if (object.type === ShapeType.Rect) {
    object.y.value += object.vx.value * dt;
  }
};

// export const createBouncingExample = (circleObject: CircleInterface) => {
//   'worklet';
//   circleObject.r = RADIUS;
//   circleObject.ax = 0.5;
//   circleObject.ay = 1;
//   circleObject.vx.value = MAX_SPEED - 10;
//   circleObject.vy.value = MAX_SPEED - 10;
//   circleObject.m = RADIUS * 10;
// };

export const animate = (
  objects: ShapeInterface[],
  timeSincePreviousFrame: number,
) => {
  'worklet';

  for (const o of objects) {
    const gameSpeed = 0.15;
    const normalFPSmilliseconds = 16;
    const fpsUpdateInterval =
      (gameSpeed / normalFPSmilliseconds) * timeSincePreviousFrame;
    move(o, fpsUpdateInterval);
  }

  const gen = () => {
    const randomHex = () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0');
    return `#${randomHex()}${randomHex()}${randomHex()}`;
  };

  for (const o of objects) {
    if (o.type === ShapeType.Circle) {
      resolveWallCollision(o);
    }
    if (o.type === 'Rect') {
      const rectObject = o as RectInterface;
      const rectsUnderTheScreen = rectObject.y.value > windowHeight;
      if (rectsUnderTheScreen) {
        const newColor = gen();
        const newHeight = RECT_HEIGHT * (Math.random() * 5);
        rectObject.y.value = -windowHeight - Math.random() * 10;
        rectObject.x.value = Math.random() * windowWidth;
        rectObject.height.value = newHeight;
        rectObject.color.value = newColor;
      }
    }
  }
};

export const animateWallCollisions = (
  draggableCircleObj: PlayerCircleInterface,
  walls: RectInterface[],
) => {
  'worklet';
  const collisions: Collision[] = [];

  for (const wall of walls) {
    const {collided, collisionInfo} = checkCollisionCircleRect(
      draggableCircleObj,
      wall,
    );
    if (collided && collisionInfo) {
      collisions.push(collisionInfo);
    }
    // if (draggableCircleObj.color.value !== 'black')
    //   draggableCircleObj.color.value = 'black';
  }
  for (const col of collisions) {
    resolveCollisionWithWall(col);
  }
};

export const animateLineStartPoint = (
  objects: {
    draggableCircleObj: PlayerCircleInterface;
    lineObj: LineInterface;
  },
  isFingerOnTheScreen: boolean,
  lineVecP2: {dx: number; dy: number},
) => {
  'worklet';
  if (!isFingerOnTheScreen) return;
  objects.lineObj.p1.value = vec(
    objects.draggableCircleObj.x.value,
    objects.draggableCircleObj.y.value,
  );
  const nx = objects.draggableCircleObj.x.value - lineVecP2.dx;
  const ny = objects.draggableCircleObj.y.value - lineVecP2.dy;
  objects.lineObj.p2.value = vec(nx, ny);
};

export const calculateFps = (
  frameInfo: FrameInfo,
  frameCountRef: React.MutableRefObject<number>,
  lastFrameTimeRef: React.MutableRefObject<number>,
  updateFps: (fps: number) => void,
) => {
  'worklet';

  const currentTime = frameInfo.timeSinceFirstFrame;
  frameCountRef.current++;

  if (lastFrameTimeRef.current === 0) {
    lastFrameTimeRef.current = currentTime;
    return;
  }

  const delta = currentTime - lastFrameTimeRef.current;
  if (delta >= 1000) {
    const calculatedFps = Math.round((frameCountRef.current * 1000) / delta);
    frameCountRef.current = 0;
    lastFrameTimeRef.current = currentTime;

    runOnJS(updateFps)(calculatedFps);
  }
};
