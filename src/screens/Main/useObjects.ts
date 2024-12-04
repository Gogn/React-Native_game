import {
  CircleInterface,
  PlayerCircleInterface,
  LineInterface,
  RectInterface,
  ShapeType,
} from './types.ts';
import {useSharedValue} from 'react-native-reanimated';
import {RADIUS} from './constants.ts';
import {vec} from '@shopify/react-native-skia';

export const useObjects = () => {
  const circleObj: CircleInterface = {
    type: ShapeType.Circle,
    id: 0,
    x: useSharedValue(RADIUS),
    y: useSharedValue(RADIUS),
    r: RADIUS,
    m: 0,
    ax: 0,
    ay: 0,
    vx: useSharedValue(0),
    vy: useSharedValue(0),
    canCollide: true,
    isDraggable: false,
  };

  const PlayerObj: PlayerCircleInterface = {
    type: ShapeType.Circle,
    id: 0,
    x: useSharedValue(100),
    y: useSharedValue(500),
    r: RADIUS,
    m: 0,
    ax: 0,
    ay: 0,
    vx: useSharedValue(0),
    vy: useSharedValue(0),
    canCollide: true,
    isDraggable: true,
    color: useSharedValue('black'),
    lastTimeCollision: new Date().getTime(),
  };

  const rectObj: RectInterface = {
    type: ShapeType.Rect,
    id: 0,
    x: useSharedValue(100),
    y: useSharedValue(0),
    width: useSharedValue(50),
    height: useSharedValue(100),
    m: 0,
    ax: 0,
    ay: 0,
    vx: useSharedValue(0),
    vy: useSharedValue(0),
    canCollide: true,
    isDraggable: false,
  };

  const lineObj: LineInterface = {
    color: 'lightblue',
    p1: useSharedValue(vec(0, 0)),
    p2: useSharedValue(vec(0, 0)),
  };

  return {
    circleObj,
    PlayerObj: PlayerObj,
    rectObj,
    lineObj,
  };
};
