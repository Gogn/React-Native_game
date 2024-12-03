import {SharedValue} from 'react-native-reanimated';

export enum ShapeType {
  Circle = 'Circle',
  Paddle = 'Paddle',
  Rect = 'Rect',
  Line = 'Line',
}

export interface ShapeInterface {
  id: number;
  x: SharedValue<number>; // x position
  y: SharedValue<number>; // y position
  m: number; // Mass of the shape
  ax: number; // Acceleration of x
  ay: number; // Acceleration of y
  vx: SharedValue<number>; // Velocity of x
  vy: SharedValue<number>; // Velocity of y
  type: ShapeType; // Type
  isDraggable: boolean;
}

export interface CircleInterface extends ShapeInterface {
  type: ShapeType.Circle;
  isDraggable: false;
  r: number;
  canCollide: boolean;
}

export interface DraggableCircleInterface extends ShapeInterface {
  type: ShapeType.Circle;
  isDraggable: true;
  r: number;
  canCollide: boolean;
}

export interface Collision {
  o1: ShapeInterface; // First shape
  o2: ShapeInterface; // The second shape
  dx: number; // Distance between the two x values
  dy: number; // Distance between the two y values
  d: number; // Total distance
}

export interface RectInterface extends ShapeInterface {
  type: ShapeType.Rect;
  isDraggable: false;
  width: number;
  height: number;
  canCollide: boolean;
  color: SharedValue<string>;
}

export interface LineInterface {
  type: ShapeType.Line;
  color: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
}
