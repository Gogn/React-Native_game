import React, {useRef, useState} from 'react';
import {Canvas, Circle, Rect} from '@shopify/react-native-skia';
import {RectInterface, ShapeType} from './types.ts';
import {useFrameCallback, useSharedValue} from 'react-native-reanimated';
import {
  RECT_HEIGHT,
  RECT_WIDTH,
  WALLS_AMOUNT,
  WALLS_SPEED,
  windowHeight,
  windowWidth,
} from './constants.ts';
import {
  animate,
  calculateFps,
  createBouncingExample,
} from './functions/functions.ts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useObjects} from './useObjects.ts';
import {Text, View} from 'react-native';

const generateRandomColor = () => {
  const randomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
  return `#${randomHex()}${randomHex()}${randomHex()}`;
};

export const Main = () => {
  const {circleObj, draggableCircleObj, rectObj} = useObjects();
  const [showFps, setShowFps] = useState(false);
  const [fps, setFps] = useState(0);
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const calcWallHeight = RECT_HEIGHT * (Math.random() * 5);

  const wallsHeights = Array(WALLS_AMOUNT)
    .fill(0)
    .map(() => calcWallHeight);
  const wallsYs = Array(WALLS_AMOUNT);
  wallsYs[0] = -wallsHeights[0];
  for (let i = 1; i < wallsYs.length; i++) {
    // Make walls one after another on Y. + overlapping.
    wallsYs[i] = wallsYs[i - 1] - wallsHeights[i] + 50;
  }
  // console.log('wallsHeights', wallsHeights);
  // console.log('wallsYs', wallsYs);
  const walls: RectInterface[] = Array(WALLS_AMOUNT).fill(0);
  // .fill(0)
  // .map((_, i) => {
  //   return {
  //     x: useSharedValue(Math.random() * windowWidth),
  //     y: useSharedValue(100 - wallsYs[i]),
  //     width: RECT_WIDTH,
  //     height: wallsHeights[i],
  //     color: useSharedValue(generateRandomColor()),
  //     i,
  //     ax: 0,
  //     ay: 0,
  //     canCollide: false,
  //     isDraggable: false,
  //     type: ShapeType.Rect,
  //     vy: 0,
  //     vx: WALLS_SPEED,
  //     m: 0,
  //   };
  // });
  for (let i = 0; i < WALLS_AMOUNT; i++) {
    const placing = Math.random();
    const isLeftSide = placing < 0.3;
    const isRightSide = placing > 0.7;

    const x = isLeftSide
      ? 0
      : isRightSide
      ? windowWidth - RECT_WIDTH
      : useSharedValue(Math.random() * windowWidth);
    walls[i] = {
      x,
      y: useSharedValue(wallsYs[i]),
      width: RECT_WIDTH,
      height: wallsHeights[i],
      color: useSharedValue(generateRandomColor()),
      i,
      ax: 0,
      ay: 0,
      canCollide: false,
      isDraggable: false,
      type: ShapeType.Rect,
      vy: 0,
      vx: WALLS_SPEED,
      m: 0,
    };
  }

  for (const w of walls) {
    // console.log('y', w.y.value);
    console.log('y', w.y.value);
  }

  const Wall = ({idx, rect}: {idx: number; rect: RectInterface}) => {
    return (
      <Rect
        key={idx}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        color={rect.color}
      />
    );
  };

  const updateFps = (fps: number) => {
    setFps(fps);
  };
  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    if (showFps) {
      calculateFps(frameInfo, frameCountRef, lastFrameTimeRef, updateFps);
    }

    animate(
      [circleObj, draggableCircleObj, ...walls],
      frameInfo.timeSincePreviousFrame,
    );
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      //   resetGame();
      // }
    })
    .onChange(({x, y}) => {
      draggableCircleObj.x.value = x;
      draggableCircleObj.y.value = y;
    });

  createBouncingExample(circleObj);

  const Level = () => {
    return (
      <>
        {walls.map((wall, idx) => (
          <Wall key={idx} rect={wall} idx={idx} />
        ))}
      </>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={gesture}>
        <View>
          <Text style={{position: 'absolute', top: 50, left: 50}}>{fps}</Text>
          <Canvas style={{width: windowWidth, height: windowHeight}}>
            <Level />
            {/*<Circle*/}
            {/*  cx={circleObj.x}*/}
            {/*  cy={circleObj.y}*/}
            {/*  r={circleObj.r}*/}
            {/*  color={'magenta'}*/}
            {/*/>*/}
            {/*<Circle*/}
            {/*  cx={draggableCircleObj.x}*/}
            {/*  cy={draggableCircleObj.y}*/}
            {/*  r={draggableCircleObj.r}*/}
            {/*  color={'black'}*/}
            {/*/>*/}
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
