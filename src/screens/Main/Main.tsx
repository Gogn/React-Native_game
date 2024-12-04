import React, {useRef, useState} from 'react';
import {Canvas, vec} from '@shopify/react-native-skia';
import {useFrameCallback, useSharedValue} from 'react-native-reanimated';
import {PLAYER_SPEED_REDUCE, windowHeight, windowWidth} from './constants.ts';
import {
  animate,
  animateLineStartPoint,
  animateWallCollisions,
  calculateFps,
} from './functions/functions.ts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useObjects} from './useObjects.ts';
import {Text, View} from 'react-native';
import {useInitializeWalls} from './hooks/useInitializeWalls.ts';
import {Player} from './Components/Player.tsx';
import {Path} from './Components/Path.tsx';
import {Walls} from './Components/Walls.tsx';

export const Main = () => {
  const {PlayerObj, lineObj} = useObjects();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFps, setShowFps] = useState(false);
  const [fps, setFps] = useState(0);
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  let startCoordinates = useSharedValue({x: 0, y: 0});
  const lineVecP2 = useSharedValue({dx: 0, dy: 0});
  const isFingerOnTheScreen = useSharedValue(false);
  const walls = useInitializeWalls();

  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    if (showFps) {
      calculateFps(frameInfo, frameCountRef, lastFrameTimeRef, setFps);
    }

    animate([PlayerObj, ...walls], frameInfo.timeSincePreviousFrame);
    animateLineStartPoint(
      {draggableCircleObj: PlayerObj, lineObj},
      isFingerOnTheScreen.value,
      lineVecP2.value,
    );
    animateWallCollisions(PlayerObj, walls);
  });

  const panGesture = Gesture.Pan()
    .onBegin(({x, y}) => {
      startCoordinates.value = {x, y};
      isFingerOnTheScreen.value = true;
    })
    .onEnd(({x, y}) => {
      const difX = x - startCoordinates.value.x;
      const difY = y - startCoordinates.value.y;
      PlayerObj.vx.value = PlayerObj.vx.value + difX * PLAYER_SPEED_REDUCE;
      PlayerObj.vy.value = PlayerObj.vy.value + difY * PLAYER_SPEED_REDUCE;
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

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={panGesture}>
        <View>
          <Text style={{position: 'absolute', top: 50, left: 50}}>{fps}</Text>
          <Canvas style={{width: windowWidth, height: windowHeight}}>
            <Walls walls={walls} />
            <Player player={PlayerObj} />
            <Path path={lineObj} />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
