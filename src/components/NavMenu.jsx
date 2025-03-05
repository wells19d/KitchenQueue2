//*NavMenu.jsx
import React from 'react';
import {Text, View} from 'react-native';
import CurvedBottomBar from './CurvedBottomBar';
import {useDeviceInfo} from '../hooks/useHooks';

const NavMenu = props => {
  const {bottomBgColor, bottomHeight, bottomWidth} = props;
  const MenuButton = () => {};
  const NavBar = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          height: '100%',
          width: '100%',
        }}>
        <CurvedBottomBar
          height={bottomHeight}
          width={bottomWidth}
          fill={bottomBgColor}
          stroke="#373d4340"
          strokeWidth={1.5}
          shadowStroke="#373d4320"
          shadowStrokeWidth={4}
        />
      </View>
    );
  };

  return (
    <View>
      <MenuButton />
      <NavBar />
    </View>
  );
};

export default NavMenu;
