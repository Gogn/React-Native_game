import {
  playerInitialColor,
  playerInitialIsDead,
  playerInitialVX,
  playerInitialVY,
  playerInitialX,
  playerInitialY,
} from '../objectsInitials.ts';
import {PlayerCircleInterface, RectInterface} from '../types.ts';
import {SharedValue} from 'react-native-reanimated';

type ResetGameProps = {
  playerObj: PlayerCircleInterface;
  fillWallsInitials: (walls: RectInterface[]) => void;
  walls: RectInterface[];
  score: SharedValue<string>;
  gameStartTime: SharedValue<number>;
};

export const resetGame = (props: ResetGameProps) => {
  'worklet';
  const {playerObj, fillWallsInitials, walls, score, gameStartTime} = props;

  playerObj.x.value = playerInitialX;
  playerObj.y.value = playerInitialY;
  playerObj.vx.value = playerInitialVX;
  playerObj.vy.value = playerInitialVY;
  playerObj.color.value = playerInitialColor;
  playerObj.gameOverText.value = playerInitialIsDead;

  fillWallsInitials(walls);

  score.value = '0';

  gameStartTime.value = new Date().getTime();
};
