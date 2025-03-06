//*NavMenu.jsx
import React, {useMemo} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CurvedBottomBar from './CurvedBottomBar';
import {Icons} from '../components/IconListRouter';
import {useNavigation} from '@react-navigation/native';
import {getNavBarHeight} from '../utilities/deviceUtils';

const NavMenu = props => {
  const {bottomHeight, bottomWidth, toggleMenu, device} = props;
  const navigation = useNavigation();

  const navHeight = useMemo(
    () => getNavBarHeight(device, bottomHeight),
    [device, bottomHeight],
  );

  const userItems = [
    {
      id: 'shopping',
      title: 'Shopping',
      icon: <Icons.Shopping size={25} color={'#000'} />,
      screen: 'ShoppingList',
    },
    {
      id: 'cupboard',
      title: 'Cupboard',
      icon: <Icons.Cupboards size={25} color={'#000'} />,
      screen: 'CupboardList',
    },
  ];

  const getNavBarLayout = (items = []) => {
    const requiredItems = [
      {
        id: 'home',
        title: 'Home',
        icon: <Icons.Home size={27} color={'#000'} />,
        screen: 'Home',
      },
      {
        id: 'account',
        title: 'Account',
        icon: <Icons.Account size={25} color={'#000'} />,
        screen: 'Account',
      },
    ];

    // Combine required and user items, Home first, Account last
    let allItems = [requiredItems[0], ...items, requiredItems[1]];

    // Ensure odd number of slots (to keep center slot open)
    if (allItems.length % 2 === 0) {
      allItems.splice(Math.floor(allItems.length / 2), 0, {id: 'spacer'}); // Center spacer
    }

    return allItems;
  };

  const navItems = getNavBarLayout(userItems);

  const handleNavPress = item => {
    const allowedScreens = ['Home', 'ShoppingList', 'CupboardList', 'Account'];

    if (allowedScreens.includes(item.screen)) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Coming Soon', `${item.title} screen not yet available.`);
    }
  };

  return (
    <View style={NavMenuStyles.container}>
      <View style={{height: navHeight}}>
        <CurvedBottomBar
          height={bottomHeight}
          width={bottomWidth}
          fill={CurvedBarStyles.fillColor}
          stroke={CurvedBarStyles.strokeColor}
          strokeWidth={CurvedBarStyles.strokeWidth}
          shadowStroke={CurvedBarStyles.shadowStroke}
          shadowStrokeWidth={CurvedBarStyles.shadowStrokeWidth}
        />
        <View style={MenuButtonStyles.wrapper}>
          {navItems.map((item, index) => {
            if (item.id === 'spacer') {
              return (
                <View key={index} style={MenuButtonStyles.container}>
                  <TouchableOpacity
                    style={MenuButtonStyles.button}
                    onPress={toggleMenu}>
                    <Icons.Menu size={30} color={'#fff'} />
                  </TouchableOpacity>
                </View>
              );
            }
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleNavPress(item)}
                style={MenuButtonStyles.menuButton}>
                {item.icon}
                <Text style={{fontSize: 10}}>{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default NavMenu;

const NavMenuStyles = StyleSheet.create({
  container: {flex: 1},
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    padding: 5,
  },
});

const CurvedBarStyles = StyleSheet.create({
  fillColor: '#f7f7f7',
  strokeColor: '#373d4340',
  strokeWidth: 1.5,
  shadowStroke: '#373d4320',
  shadowStrokeWidth: 4,
});

const MenuButtonStyles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 2000, // Bottom Layer
  },
  container: {
    flex: 1,
    height: 65,
    position: 'relative',
    top: -21,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    zIndex: 2100, // Middle Layer
  },
  button: {
    borderWidth: 1,
    height: 55,
    width: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: '#c4c4c480',
    backgroundColor: '#319177',
    zIndex: 2200, // Top Layer
  },
  menuButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2200, // Top Layer
  },
});
