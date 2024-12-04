import {RectInterface} from '../types.ts';
import {Wall} from './Wall.tsx';

export const Walls = ({walls}: {walls: RectInterface[]}) => {
  return (
    <>
      {walls.map((wall, idx) => (
        <Wall key={idx} rect={wall} idx={idx} />
      ))}
    </>
  );
};
