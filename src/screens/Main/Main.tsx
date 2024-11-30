import React from "react";
import {
  Canvas,
  Circle,
  Rect,
} from '@shopify/react-native-skia';
import {
  CircleInterface,
  DraggableCircleInterface,
  ShapeType,
} from './types.ts';
import {
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import {
  height,
  RADIUS,
  width,
} from './constants.ts';
import {
  animate,
  createBouncingExample,
} from './functions/functions.ts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export const Main = () => {
  const brickCount = useSharedValue(0);

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
    r: RADIUS*2,
    m: 0,
    ax: 0,
    ay: 0,
    vx: 0,
    vy: 0,
    canCollide: true,
    isDraggable: true,
  }

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    animate(
      [circleObj, draggableCircleObj],
      frameInfo.timeSincePreviousFrame,
      brickCount
    );
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      //   resetGame();
      // }
    })
    .onChange(({ x, y }) => {
      // draggableCircleObj.x.value = x - PADDLE_WIDTH / 2;
      draggableCircleObj.x.value = x;
      draggableCircleObj.y.value = y;
    });

  createBouncingExample(circleObj);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
          <Circle
            cx={circleObj.x}
            cy={circleObj.y}
            r={circleObj.r}
            color={'magenta'}
          />
          <Circle
            cx={draggableCircleObj.x}
            cy={draggableCircleObj.y}
            r={draggableCircleObj.r}
            color={'black'}
          />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
