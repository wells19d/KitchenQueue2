//* KQText.jsx
import React from 'react';
import {Text as KQText, View} from 'react-native';
import {useColors, useFonts, useSizes} from './KQUtilities';

export const Text = ({
  children,
  style,
  size = 'medium',
  kqColor = 'black',
  font = 'Noto-5',
  ...props
}) => {
  const setColor = useColors(kqColor);
  const setFont = useFonts(font);
  const setSize = useSizes(size, font);

  return (
    <View style={{borderWidth: 1, padding: 0, margin: 0}}>
      <KQText style={[setColor, setFont, setSize, style]} {...props}>
        {children}
      </KQText>
    </View>
  );
};
