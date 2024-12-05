import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Canvas, vec} from '@shopify/react-native-skia';
import {useFrameCallback, useSharedValue} from 'react-native-reanimated';
import {PLAYER_SPEED_REDUCE, windowHeight, windowWidth} from './constants.ts';
import {
  animate,
  animateLineStartPoint,
  animateWallCollisions,
  calculateFps,
  updateScore,
} from './functions/functions.ts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useObjects} from './useObjects.ts';
import {useInitializeWalls} from './hooks/useInitializeWalls.ts';
import {Player} from './Components/Player.tsx';
import {Path} from './Components/Path.tsx';
import {Walls} from './Components/Walls.tsx';
import {GameOverText} from './Components/GameOverText.tsx';
import {FpsText} from './Components/FpsText.tsx';
import {resetGame} from './functions/resetGame.ts';
import {ScoreText} from './Components/ScoreText.tsx';

export const Main = () => {
  const {playerObj, lineObj} = useObjects();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showFps, setShowFps] = useState(false);
  const gameStartTime = useSharedValue(0);
  const fps = useSharedValue('');
  const score = useSharedValue('');
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const scoreUpdateTime = useRef(0);
  let startCoordinates = useSharedValue({x: 0, y: 0});
  const lineVecP2 = useSharedValue({dx: 0, dy: 0});
  const isFingerOnTheScreen = useSharedValue(false);
  const {walls, fillWallsInitials} = useInitializeWalls();

  useFrameCallback(frameInfo => {
    if (!frameInfo.timeSincePreviousFrame) {
      return;
    }

    if (showFps) {
      const setFps = (newFps: number) => {
        fps.value = `${newFps}`;
      };
      calculateFps(frameInfo, frameCountRef, lastFrameTimeRef, setFps);
    }

    updateScore({
      score,
      isGameStart: playerObj.gameOverText.value === '',
      scoreUpdateTime,
      currentTime: frameInfo.timestamp,
    });
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
      if (playerObj.gameOverText.value !== '') {
        resetGame({
          fillWallsInitials,
          walls,
          playerObj,
          score,
          gameStartTime,
        });
      }
      // if (score.value === '0') {
      //
      // }
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Canvas style={styles.canvasContainer}>
          <Walls walls={walls} />
          <Player player={playerObj} />
          <Path path={lineObj} />
          <ScoreText score={score} />
          <FpsText fps={fps} />
          <GameOverText isDead={playerObj.gameOverText} />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    backgroundColor: 'white',
    width: windowWidth,
    height: windowHeight,
  },
});
