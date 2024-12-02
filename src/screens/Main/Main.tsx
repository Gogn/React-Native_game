import React, {useRef, useState} from 'react';
import {Canvas, Circle, Rect} from '@shopify/react-native-skia';
import {RectInterface, ShapeType} from './types.ts';
import {
  runOnJS,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import {
  height,
  RECT_HEIGHT,
  RECT_WIDTH,
  WALLS_SPEED,
  width,
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

  const walls: RectInterface[] = Array(3)
    .fill(0)
    .map((_, id) => {
      return {
        x: useSharedValue(Math.random() * width),
        y: useSharedValue(Math.random() * (-height * 0.3)),
        width: RECT_WIDTH,
        height: RECT_HEIGHT,
        color: useSharedValue(generateRandomColor()),
        id,
        ax: 0,
        ay: 0,
        canCollide: false,
        isDraggable: false,
        type: ShapeType.Rect,
        vy: 0,
        vx: WALLS_SPEED,
        m: 0,
      };
    });

  const Wall = ({idx, rect}: {idx: number; rect: RectInterface}) => {
    return (
      <Rect
        key={idx}
        x={rect.x}
        y={rect.y}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
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

    if (!showFps) {
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
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
