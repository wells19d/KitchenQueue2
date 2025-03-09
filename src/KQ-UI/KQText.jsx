//* KQText.jsx
import React from 'react';
import {Text as KQText, View} from 'react-native';
import {useColors, useFonts, useSizes} from './KQUtilities';

export const Text = ({
  children,
  style,
  size = 'medium',
  kqColor = 'black',
  font = 'open-5',
  ...props
}) => {
  const setColor = useColors(kqColor);
  const setFont = useFonts(font);
  const setSize = useSizes(size, font);

  return (
    <KQText style={[setColor, setFont, setSize, style]} {...props}>
      {children}
    </KQText>
  );
};
