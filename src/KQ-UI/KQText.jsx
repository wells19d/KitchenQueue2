//* KQText.jsx
import React from 'react';
import {Text} from 'react-native';
import {useFontStyles} from './KQUtilities';

const KQText = ({
  children,
  style,
  size = 'medium',
  kqColor = 'black',
  font = 'open-5',
  ...props
}) => {
  const fontStyles = useFontStyles(font, size, kqColor);

  return (
    <Text allowFontScaling={false} style={[fontStyles, style]} {...props}>
      {children}
    </Text>
  );
};

export default React.memo(KQText);
