import React, {
  useEffect,
  useState,
} from 'react';
import {Canvas, Circle, Rect} from '@shopify/react-native-skia';
import {
  CircleInterface,
  DraggableCircleInterface,
  RectInterface,
  ShapeType,
} from './types.ts';
import {useFrameCallback, useSharedValue} from 'react-native-reanimated';
import {height, RADIUS, width} from './constants.ts';
import {animate, createBouncingExample} from './functions/functions.ts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const generateRandomColor = () => {
  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  return `#${randomHex()}${randomHex()}${randomHex()}`;
};

export const Main = () => {
  // const brickCount = useSharedValue(0);

  const positions = useSharedValue([{ y: 0, x: 0, color: 'red'}]);
  // const colors = useSharedValue([]);

  useEffect(() => {
    // Initialize rectangles
    const initialRects = Array.from({ length: 2 }).map((_, index) => ({
      y: RECT_HEIGHT * index*3,
      x: ((width - RECT_WIDTH) / 2)*index,
      color: generateRandomColor(),
    }));
    positions.value = initialRects.map((rect) => {
      return { y: rect.y, x: rect.x, color: rect.color };
    });
    // colors.value = initialRects.map((rect) => rect.color);
  }, []);

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
    r: RADIUS * 2,
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
const RECT_HEIGHT = 100
  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    animate(
      [circleObj, draggableCircleObj],
      frameInfo.timeSincePreviousFrame,
      // brickCount,
    );

  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      //   resetGame();
      // }
    })
    .onChange(({x, y}) => {
      // draggableCircleObj.x.value = x - PADDLE_WIDTH / 2;
      draggableCircleObj.x.value = x;
      draggableCircleObj.y.value = y;
    });

  createBouncingExample(circleObj);
const RECT_WIDTH = 50;
  const Level = () => {
    // const generateRect = () => {
    //   for (let i = 0; i < 2; i++) {
    //     const xx = (rectObj.x)+(i*20)
    //     return <Rect x={xx} y={rectObj.y} width={rectObj.width} height={rectObj.height} color="Blue"/>;
    //   }
    // };
    //
    // return generateRect()
    // return <Rect x={rectObj.x} y={rectObj.y} width={rectObj.width} height={rectObj.height} color="Blue" />;
    // return <Rect x={0} y={0} width={256} height={256} color="lightblue" />
    return positions.value.map((position, index) => (
      <Rect
        key={index}
        x={position.x}
        y={position.y}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        color={position.color}
      />
    ))
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{width, height}}>
          <Level />
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
};
