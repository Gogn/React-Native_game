import {
  CircleInterface,
  Collision,
  PlayerCircleInterface,
  RectInterface,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {circleCircle} from './shapeCollisions/circleCircle.ts';
import {WALLS_SPEED, windowHeight, windowWidth} from '../constants.ts';
import {circleRect} from './shapeCollisions/circleRect.ts';

export const resolveCollisionWithWall = (info: Collision) => {
  'worklet';
  const player = info.o1 as PlayerCircleInterface;
  const time = new Date().getTime();

  if (time - player.lastTimeCollision > 100) {
    player.vx.value = 0;
    player.vy.value = WALLS_SPEED;
    player.ax = 0;
    player.ay = 0;
    player.color.value = 'red';
    player.lastTimeCollision = time;
  } else {
    player.color.value = 'black';
  }
};

// Source: https://martinheinz.dev/blog/15
export const resolveWallCollision = (object: ShapeInterface) => {
  'worklet';

  if (object.type === ShapeType.Circle) {
    const circleObject = object as CircleInterface;
    // Collision with the right wall
    if (circleObject.x.value + circleObject.r > windowWidth) {
      circleObject.x.value = windowWidth - circleObject.r;
      circleObject.vx.value = -circleObject.vx.value;
      circleObject.ax = -circleObject.ax;
    }

    // Collision with the bottom wall
    else if (circleObject.y.value + circleObject.r > windowHeight) {
      circleObject.y.value = windowHeight - circleObject.r;
      circleObject.vy.value = -circleObject.vy.value;
      circleObject.ay = -circleObject.ay;
      return true;
    }

    // Collision with the left wall
    else if (circleObject.x.value - circleObject.r < 0) {
      circleObject.x.value = circleObject.r;
      circleObject.vx.value = -circleObject.vx.value;
      circleObject.ax = -circleObject.ax;
    }

    // Detect collision with the top wall
    else if (circleObject.y.value - circleObject.r < 0) {
      circleObject.y.value = circleObject.r;
      circleObject.vy.value = -circleObject.vy.value;
      circleObject.ay = -circleObject.ay;
    }

    return false;
  }
};

export const checkCollision = (o1: ShapeInterface, o2: ShapeInterface) => {
  'worklet';
  // Circle-Circle
  if (o1.type === ShapeType.Circle && o2.type === ShapeType.Circle) {
    const circle1 = o1 as CircleInterface;
    const circle2 = o2 as CircleInterface;
    return checkCollisionCircleCircle(circle1, circle2);
  }

  // Circle-Rect
  if (o1.type === ShapeType.Circle && o2.type === ShapeType.Rect) {
    const circle1 = o1 as CircleInterface;
    const Rect1 = o2 as RectInterface;
    return checkCollisionCircleRect(circle1, Rect1);
  }
};

export const checkCollisionCircleRect = (
  circleObj: CircleInterface | PlayerCircleInterface,
  rectObj: RectInterface,
) => {
  'worklet';

  if (!rectObj.canCollide) {
    return {
      collisionInfo: null,
      collided: false,
    };
  }

  const dx = rectObj.x.value - circleObj.x.value;
  const dy = rectObj.y.value - circleObj.y.value;
  const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  const isCollision = circleRect(
    circleObj.x.value,
    circleObj.y.value,
    circleObj.r,
    rectObj.x.value,
    rectObj.y.value,
    rectObj.width.value,
    rectObj.height.value,
  );

  if (isCollision) {
    return {
      collisionInfo: {o1: circleObj, o2: rectObj, dx, dy, d},
      collided: true,
    };
  }
  return {
    collisionInfo: null,
    collided: false,
  };
};

export const checkCollisionCircleCircle = (
  circle1: CircleInterface,
  circle2: CircleInterface,
) => {
  'worklet';
  if (!circle2.canCollide) {
    return {
      collisionInfo: null,
      collided: false,
    };
  }
  const isCollision = circleCircle(
    circle1.x.value,
    circle1.y.value,
    circle1.r,
    circle2.x.value,
    circle2.y.value,
    circle2.r,
  );

  if (isCollision) {
    const dx = circle1.x.value - circle2.x.value;
    const dy = circle1.y.value - circle2.y.value;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return {
      collisionInfo: {o1: circle1, o2: circle2, dx, dy, d},
      collided: true,
    };
  }
  return {
    collisionInfo: null,
    collided: false,
  };
};
