//* KQLayout

import React from 'react';
import {View} from 'react-native';

const KQLayout = ({children, bgColor = '#ffffff', styles}) => {
  return (
    <View style={[{flex: 1, backgroundColor: bgColor}, styles]}>
      {children}
    </View>
  );
};

export default KQLayout;
