import {RectInterface} from '../types.ts';
import {Rect} from '@shopify/react-native-skia';
import React from 'react';

export const Wall = ({idx, rect}: {idx: number; rect: RectInterface}) => {
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
