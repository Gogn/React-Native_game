import {matchFont, Text} from '@shopify/react-native-skia';
import React from 'react';
import {fontStyleSmall} from '../constants.ts';
import {SharedValue} from 'react-native-reanimated';

export const FpsText = ({fps}: {fps: SharedValue<string>}) => {
  const font = matchFont(fontStyleSmall);
  return <Text x={20} y={80} text={fps} font={font} />;
};
