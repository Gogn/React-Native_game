import {
  CircleInterface,
  Collision,
  DraggableCircleInterface,
  RectInterface,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {circleCircle} from './shapeCollisions/circleCircle.ts';
import {windowHeight, windowWidth} from '../constants.ts';
import {circleRect} from './shapeCollisions/circleRect.ts';

export const resolveCollisionWithWall = (info: Collision) => {
  'worklet';
  const circleObj = info.o1 as DraggableCircleInterface;

  // circleInfo.y.value = circleInfo.y.value - circleInfo.r;

  circleObj.vx.value = 0;
  circleObj.vy.value = 0;
  circleObj.ax = 0;
  circleObj.ay = 0;
  circleObj.color.value = 'red';
};

// Source: https://martinheinz.dev/blog/15
export const resolveWallCollision = (object: ShapeInterface) => {
  'worklet';

  // Reset Circle state
  // circleObject.x.value = 100;
  // circleObject.y.value = 150;
  // circleObject.ax = 0.5;
  // circleObject.ay = 1;
  // circleObject.vx = 0;
  // circleObject.vy = 0;

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
    return checkCollisionCircleCircle(o1, o2);
  }

  // Circle-Rect
  if (o1.type === ShapeType.Circle && o2.type === ShapeType.Rect) {
    return checkCollisionCircleRect(o1, o2);
  }
};

export const checkCollisionCircleRect = (
  circleObj: DraggableCircleInterface,
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
    // console.log('isCollision', new Date().getUTCMilliseconds());
    console.log('rectObj', JSON.stringify(rectObj, null, 2));
    // console.log('circleObj', circleObj);
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
    // if (o2.type === "Brick") {
    //   const brick = o2 as BrickInterface;
    //   brick.canCollide.value = false;
    // }
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
