//* KQText.jsx
import React from 'react';
import {Text} from 'react-native';
import {useFontStyles} from './KQUtilities';

const KQText = ({
  children,
  italic = false,
  centered = false,
  style,
  size = 'small',
  kqColor = 'black',
  font = 'open-6',
  ...props
}) => {
  const fontStyles = useFontStyles(font, size, kqColor);

  return (
    <Text
      allowFontScaling={false}
      style={[
        fontStyles,
        {
          fontStyle: italic ? 'italic' : 'normal',
          textAlign: centered ? 'center' : 'left',
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
};

export default __DEV__ ? KQText : React.memo(KQText);
