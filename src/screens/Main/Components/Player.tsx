import {Circle} from '@shopify/react-native-skia';
import {PlayerCircleInterface} from '../types.ts';
import React from 'react';

export const Player = ({player}: {player: PlayerCircleInterface}) => {
  return (
    <Circle cx={player.x} cy={player.y} r={player.r} color={player.color} />
  );
};
