import {
  CircleInterface,
  Collision,
  ShapeInterface,
  ShapeType,
} from '../types.ts';
import {
  MAX_SPEED,
  RADIUS,
} from '../constants.ts';
import {
  checkCollision,
  resolveCollisionWithBounce,
  resolveWallCollision,
} from './collisions.ts';

const move = (object: ShapeInterface, dt: number) => {
  'worklet';
  if (object.type === 'Circle') {
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
};

export const createBouncingExample = (circleObject: CircleInterface) => {
  "worklet";

  // circleObject.x.value = 100;
  // circleObject.y.value = 450;
  circleObject.r = RADIUS;
  circleObject.ax = 0.5;
  circleObject.ay = 1;
  circleObject.vx = MAX_SPEED-10;
  circleObject.vy = MAX_SPEED-10;
  circleObject.m = RADIUS * 10;
};

export const animate = (
  objects: ShapeInterface[],
  timeSincePreviousFrame: number,
  // brickCount: SharedValue<number>
) => {
  "worklet";

  for (const o of objects) {
    move(o, (0.15 / 16) * timeSincePreviousFrame);
  }

  for (const o of objects) {
    if (o.type !== ShapeType.Circle) continue;
    resolveWallCollision(o);
    // if (isGameLost) {
    //   brickCount.value = -1;
    // }
  }

  const collisions: Collision[] = [];

  for (const [i, o1] of objects.entries()) {
    for (const [j, o2] of objects.entries()) {
      if (i < j) {
        const { collided, collisionInfo } = checkCollision(o1, o2);
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
