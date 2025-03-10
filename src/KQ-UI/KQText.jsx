//* KQText.jsx
import React from 'react';
import {Text} from 'react-native';
import {useColors, useFonts, useSizes} from './KQUtilities';

const KQText = ({
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
    <Text style={[setColor, setFont, setSize, style]} {...props}>
      {children}
    </Text>
  );
};

export default KQText;
