import {
  CircleInterface,
  Collision,
  RectInterface,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {
  MAX_SPEED,
  RADIUS,
  RECT_HEIGHT,
  windowHeight,
  windowWidth,
} from '../constants.ts';
import {
  checkCollision,
  resolveCollisionWithBounce,
  resolveWallCollision,
} from './collisions.ts';
import {FrameInfo, runOnJS} from 'react-native-reanimated';

const move = (object: ShapeInterface, dt: number) => {
  'worklet';
  if (object.type === ShapeType.Circle) {
    object.vx += object.ax * dt;
    object.vy += object.ay * dt;
    if (object.vx > MAX_SPEED) {
      object.vx = MAX_SPEED;
    }
    if (object.vx < -MAX_SPEED) {
      object.vx = -MAX_SPEED;
    }
    if (object.vy > MAX_SPEED) {
      object.vy = MAX_SPEED;
    }
    if (object.vy < -MAX_SPEED) {
      object.vy = -MAX_SPEED;
    }
    object.x.value += object.vx * dt;
    object.y.value += object.vy * dt;
  }
  if (object.type === ShapeType.Rect) {
    object.y.value += object.vx * dt;
  }
};

export const createBouncingExample = (circleObject: CircleInterface) => {
  'worklet';

  // circleObject.x.value = 100;
  // circleObject.y.value = 450;
  circleObject.r = RADIUS;
  circleObject.ax = 0.5;
  circleObject.ay = 1;
  circleObject.vx = MAX_SPEED - 10;
  circleObject.vy = MAX_SPEED - 10;
  circleObject.m = RADIUS * 10;
};

export const animate = (
  objects: ShapeInterface[],
  timeSincePreviousFrame: number,
  // brickCount: SharedValue<number>
) => {
  'worklet';

  for (const o of objects) {
    const gameSpeed = 0.15;
    const normalFPSmilliseconds = 16;
    const getFpsUpdateInterval = (timeSincePreviousFrame: number) => {
      return (gameSpeed / normalFPSmilliseconds) * timeSincePreviousFrame;
    };
    move(o, getFpsUpdateInterval(timeSincePreviousFrame));
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
        rectObject.height = newHeight;
        rectObject.color.value = newColor;
      }
    }
    // if (isGameLost) {
    //   brickCount.value = -1;
    // }
  }

  const collisions: Collision[] = [];

  for (const [i, o1] of objects.entries()) {
    for (const [j, o2] of objects.entries()) {
      if (i < j) {
        const {collided, collisionInfo} = checkCollision(o1, o2);
        if (collided && collisionInfo) {
          collisions.push(collisionInfo);
        }
      }
    }
  }

  for (const col of collisions) {
    // if (col.o2.type === "Brick") {
    //   brickCount.value++;
    // }
    resolveCollisionWithBounce(col);
  }
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
