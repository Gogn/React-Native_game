import React, {useRef, useState} from 'react';
import {Canvas, Circle, Line, Rect, vec} from '@shopify/react-native-skia';
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
  animateLineStartPoint,
  animateWallCollisions,
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
  const {circleObj, draggableCircleObj, lineObj} = useObjects();
  const [showFps, setShowFps] = useState(false);
  const [fps, setFps] = useState(0);
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const calcWallHeight = RECT_HEIGHT * (Math.random() * 5);
  let startCoordinates = useSharedValue({x: 0, y: 0});
  const lineVecP2 = useSharedValue({dx: 0, dy: 0});
  const isFingerOnTheScreen = useSharedValue(false);

  const wallsHeights = Array(WALLS_AMOUNT)
    .fill(0)
    .map(() => calcWallHeight);
  const wallsYs = Array(WALLS_AMOUNT);
  wallsYs[0] = -wallsHeights[0];
  for (let i = 1; i < wallsYs.length; i++) {
    // Make walls one after another on Y. + overlapping.
    wallsYs[i] = wallsYs[i - 1] - wallsHeights[i] + 50;
  }

  const walls: RectInterface[] = Array(WALLS_AMOUNT).fill(0);
  for (let i = 0; i < WALLS_AMOUNT; i++) {
    const placing = Math.random();
    const isLeftSide = placing < 0.3;
    const isRightSide = placing > 0.7;

    const x = isLeftSide
      ? useSharedValue(0)
      : isRightSide
      ? useSharedValue(windowWidth - RECT_WIDTH)
      : useSharedValue(Math.random() * windowWidth);
    walls[i] = {
      x,
      y: useSharedValue(wallsYs[i]),
      width: useSharedValue(RECT_WIDTH),
      height: useSharedValue(wallsHeights[i]),
      color: useSharedValue(generateRandomColor()),
      i,
      ax: 0,
      ay: 0,
      canCollide: true,
      isDraggable: false,
      type: ShapeType.Rect,
      vy: useSharedValue(0),
      vx: useSharedValue(WALLS_SPEED),
      m: 0,
    };
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
      [draggableCircleObj, ...walls],
      // [circleObj, ...walls],
      frameInfo.timeSincePreviousFrame,
      isFingerOnTheScreen,
    );
    animateLineStartPoint(
      {draggableCircleObj, lineObj},
      isFingerOnTheScreen.value,
      lineVecP2.value,
    );
    animateWallCollisions(draggableCircleObj, walls);
  });
  const speedRed = -0.2;
  const panGesture = Gesture.Pan()
    .onBegin(({x, y}) => {
      // if (brickCount.value === TOTAL_BRICKS || brickCount.value === -1) {
      //   resetGame();
      // }
      startCoordinates.value = {x, y};
      isFingerOnTheScreen.value = true;
    })
    .onEnd(({x, y}) => {
      const difX = x - startCoordinates.value.x;
      const difY = y - startCoordinates.value.y;
      draggableCircleObj.vx.value =
        draggableCircleObj.vx.value + difX * speedRed;
      draggableCircleObj.vy.value =
        draggableCircleObj.vy.value + difY * speedRed;
    })
    .onTouchesUp(() => {
      lineObj.p1.value = vec(0, 0);
      lineObj.p2.value = vec(0, 0);
      isFingerOnTheScreen.value = false;
    })
    .onChange(({x, y}) => {
      const dx = x - startCoordinates.value.x;
      const dy = y - startCoordinates.value.y;
      lineVecP2.value = {dx, dy};
    });

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
      <GestureDetector gesture={panGesture}>
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
            <Circle
              cx={draggableCircleObj.x}
              cy={draggableCircleObj.y}
              r={draggableCircleObj.r}
              color={draggableCircleObj.color}
            />
            <Line
              p1={lineObj.p1}
              p2={lineObj.p2}
              color={'lightblue'}
              style="stroke"
              strokeWidth={4}
              opacity={isFingerOnTheScreen ? 0.5 : 0}
            />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
