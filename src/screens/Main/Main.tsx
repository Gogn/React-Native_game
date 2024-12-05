import React, {useRef, useState} from 'react';
import {Canvas, vec, matchFont, Text} from '@shopify/react-native-skia';
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
import {Platform} from 'react-native';
import {useInitializeWalls} from './hooks/useInitializeWalls.ts';
import {Player} from './Components/Player.tsx';
import {Path} from './Components/Path.tsx';
import {Walls} from './Components/Walls.tsx';
import {
  playerInitialColor,
  playerInitialIsDead,
  playerInitialVX,
  playerInitialVY,
  playerInitialX,
  playerInitialY,
} from './objectsInitials.ts';

export const Main = () => {
  const {playerObj: playerObj, lineObj} = useObjects();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFps, setShowFps] = useState(false);
  const [fps, setFps] = useState(0);
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  let startCoordinates = useSharedValue({x: 0, y: 0});
  const lineVecP2 = useSharedValue({dx: 0, dy: 0});
  const isFingerOnTheScreen = useSharedValue(false);
  const {walls, fillWallsInitials} = useInitializeWalls();

  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    if (showFps) {
      calculateFps(frameInfo, frameCountRef, lastFrameTimeRef, setFps);
    }

    animate([playerObj, ...walls], frameInfo.timeSincePreviousFrame);
    animateLineStartPoint(
      {draggableCircleObj: playerObj, lineObj},
      isFingerOnTheScreen.value,
      lineVecP2.value,
    );
    animateWallCollisions(playerObj, walls);
  });

  const panGesture = Gesture.Pan()
    .onTouchesDown(() => {
      if (playerObj.isDead.value !== '') {
        playerObj.x.value = playerInitialX;
        playerObj.y.value = playerInitialY;
        playerObj.vx.value = playerInitialVX;
        playerObj.vy.value = playerInitialVY;
        playerObj.color.value = playerInitialColor;
        playerObj.isDead.value = playerInitialIsDead;

        fillWallsInitials(walls);
      }
    })
    .onBegin(({x, y}) => {
      startCoordinates.value = {x, y};
      isFingerOnTheScreen.value = true;
    })
    .onEnd(({x, y}) => {
      const difX = x - startCoordinates.value.x;
      const difY = y - startCoordinates.value.y;
      playerObj.vx.value = playerObj.vx.value + difX * PLAYER_SPEED_REDUCE;
      playerObj.vy.value = playerObj.vy.value + difY * PLAYER_SPEED_REDUCE;
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

  const fontFamily = Platform.select({ios: 'Helvetica', default: 'serif'});
  const fontStyle = {
    fontFamily,
    fontSize: 18,
  };
  const font = matchFont(fontStyle);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={{width: windowWidth, height: windowHeight}}>
          <Text x={20} y={50} text={`${fps}`} font={font} />
          <Text
            x={windowWidth / 2}
            y={windowHeight / 2}
            text={playerObj.isDead}
            font={font}
          />
          <Walls walls={walls} />
          <Player player={playerObj} />
          <Path path={lineObj} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};
