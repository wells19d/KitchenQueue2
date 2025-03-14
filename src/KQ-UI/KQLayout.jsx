//* KQLayout.jsx

import React from 'react';
import {View} from 'react-native';
import NavHeader from '../components/NavHeader';

const KQLayout = ({
  children,
  bgColor = '#ffffff',
  headerTitle = '',
  headerColor = '#319177',
  textColor = '#ffffff',
  LeftButton = '',
  RightButton = '',
  LeftAction = null,
  RightAction = null,
  sheetOpen = false,
  useHeader = true,
  innerViewStyles = {},
  outerViewStyles = {},
}) => {
  return (
    <View
      style={[
        {flex: 1, backgroundColor: bgColor, paddingBottom: 25},
        outerViewStyles,
      ]}>
      {useHeader && (
        <NavHeader
          title={headerTitle}
          headerColor={headerColor}
          textColor={textColor}
          LeftButton={LeftButton}
          RightButton={RightButton}
          LeftAction={LeftAction}
          RightAction={RightAction}
          sheetOpen={sheetOpen}
        />
      )}
      <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
    </View>
  );
};

export default KQLayout;
