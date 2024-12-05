import {Text, matchFont} from '@shopify/react-native-skia';
import React from 'react';
import {fontStyleBig, windowHeight, windowWidth} from '../constants.ts';
import {SharedValue} from 'react-native-reanimated';

export const GameOverText = ({isDead}: {isDead: SharedValue<string>}) => {
  const bigFont = matchFont(fontStyleBig);
  return (
    <>
      <Text
        x={windowWidth / 5}
        y={windowHeight / 2}
        text={isDead}
        font={bigFont}
      />
    </>
  );
};
