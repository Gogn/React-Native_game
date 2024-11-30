import {
  CircleInterface,
  DraggableCircleInterface,
  RectInterface,
  ShapeType,
} from './types.ts';
import {useSharedValue} from 'react-native-reanimated';
import {RADIUS} from './constants.ts';

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
    vx: 0,
    vy: 0,
    canCollide: true,
    isDraggable: false,
  };

  const draggableCircleObj: DraggableCircleInterface = {
    type: ShapeType.Circle,
    id: 0,
    x: useSharedValue(200),
    y: useSharedValue(500),
    r: RADIUS * 1.5,
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    canCollide: true,
    isDraggable: true,
  };

  const rectObj: RectInterface = {
    type: ShapeType.Rect,
    id: 0,
    x: useSharedValue(100),
    y: useSharedValue(0),
    width: 50,
    height: 100,
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    canCollide: true,
    isDraggable: false,
  };

  return {
    circleObj,
    draggableCircleObj,
    rectObj,
  };
};
