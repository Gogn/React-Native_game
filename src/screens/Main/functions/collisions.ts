import {
  CircleInterface,
  Collision,
  DraggableCircleInterface,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {height, PADDLE_HEIGHT, PADDLE_WIDTH, width} from '../constants.ts';
import {circleRect} from './shapeCollisions/circleRect.ts';
import {circleCircle} from './shapeCollisions/circleCircle.ts';

export const resolveCollisionWithBounce = (info: Collision) => {
  'worklet';
  const circleInfo = info.o1 as CircleInterface;

  circleInfo.y.value = circleInfo.y.value - circleInfo.r;

  // if (info.o2.type === ShapeType.Rect && circleInfo.ay > 0) {
  //   return;
  // }

  circleInfo.vx = circleInfo.vx;
  circleInfo.ax = circleInfo.ax;
  circleInfo.vy = -circleInfo.vy;
  circleInfo.ay = -circleInfo.ay;
};

// Source: https://martinheinz.dev/blog/15
export const resolveWallCollision = (object: ShapeInterface) => {
  "worklet";

  // Reset Circle state
  // circleObject.x.value = 100;
  // circleObject.y.value = 150;
  // circleObject.ax = 0.5;
  // circleObject.ay = 1;
  // circleObject.vx = 0;
  // circleObject.vy = 0;

  if (object.type === "Circle") {
    const circleObject = object as CircleInterface;
    // Collision with the right wall
    if (circleObject.x.value + circleObject.r > width) {
      circleObject.x.value = width - circleObject.r;
      circleObject.vx = -circleObject.vx;
      circleObject.ax = -circleObject.ax;
    }

    // Collision with the bottom wall
    else if (circleObject.y.value + circleObject.r > height) {
      circleObject.y.value = height - circleObject.r;
      circleObject.vy = -circleObject.vy;
      circleObject.ay = -circleObject.ay;
      return true;
    }

    // Collision with the left wall
    else if (circleObject.x.value - circleObject.r < 0) {
      circleObject.x.value = circleObject.r;
      circleObject.vx = -circleObject.vx;
      circleObject.ax = -circleObject.ax;
    }

    // Detect collision with the top wall
    else if (circleObject.y.value - circleObject.r < 0) {
      circleObject.y.value = circleObject.r;
      circleObject.vy = -circleObject.vy;
      circleObject.ay = -circleObject.ay;
    }

    return false;
  }
};

export const checkCollision = (o1: ShapeInterface, o2: ShapeInterface) => {
  "worklet";
  // Circle-Circle
  if (o1.type === ShapeType.Circle && o2.type === ShapeType.Circle) {
      const circle1 = o1 as CircleInterface;
      const circle2 = o2 as CircleInterface;
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
    )

    if (isCollision) {
      // if (o2.type === "Brick") {
      //   const brick = o2 as BrickInterface;
      //   brick.canCollide.value = false;
      // }
      const dx = circle1.x.value - circle2.x.value;
      const dy = circle1.y.value - circle2.y.value;
      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      return {
        collisionInfo: { o1, o2, dx, dy, d },
        collided: true,
      };
    }
  }

  // Circle-Rect
  if (
    (o1.type === "Circle" && o2.type === "Paddle") ||
    (o1.type === "Circle" && o2.type === ShapeType.Rect)
  ) {
    // if (o2.type === ShapeType.Brick) {
    //   const brick = o2 as BrickInterface;
    //   if (!brick.canCollide.value) {
    //     return {
    //       collisionInfo: null,
    //       collided: false,
    //     };
    //   }
    // }
    const dx = o2.x.value - o1.x.value;
    const dy = o2.y.value - o1.y.value;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    const circleObj = o1 as CircleInterface;
    const paddleObj = o2 as DraggableCircleInterface;

    const isCollision = circleRect(
      circleObj.x.value,
      circleObj.y.value,
      paddleObj.x.value,
      paddleObj.y.value,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    if (isCollision) {
      // if (o2.type === "Brick") {
      //   const brick = o2 as BrickInterface;
      //   brick.canCollide.value = false;
      // }
      return {
        collisionInfo: { o1, o2, dx, dy, d },
        collided: true,
      };
    }
  }
  return {
    collisionInfo: null,
    collided: false,
  };
};
