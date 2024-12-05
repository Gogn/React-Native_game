import {matchFont, Text} from '@shopify/react-native-skia';
import React from 'react';
import {fontStyleMedium, windowWidth} from '../constants.ts';
import {SharedValue} from 'react-native-reanimated';

export const ScoreText = ({score}: {score: SharedValue<string>}) => {
  const font = matchFont(fontStyleMedium);
  return <Text x={windowWidth - 100} y={80} text={score} font={font} />;
};
