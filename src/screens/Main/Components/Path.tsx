import {LineInterface} from '../types.ts';
import {Line} from '@shopify/react-native-skia';
import React from 'react';

export const Path = ({path}: {path: LineInterface}) => {
  return (
    <Line
      p1={path.p1}
      p2={path.p2}
      color={'lightblue'}
      style="stroke"
      strokeWidth={4}
    />
  );
};
