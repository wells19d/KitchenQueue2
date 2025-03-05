//*NavMenu.jsx
import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CurvedBottomBar from './CurvedBottomBar';
import {Icons} from '../components/IconListRouter';
import {useNavigation} from '@react-navigation/native';

const NavMenu = props => {
  const {bottomBgColor, bottomHeight, bottomWidth, toggleMenu} = props;
  const navigation = useNavigation();

  const MenuButton = () => (
    <View style={MenuButtonStyles.container}>
      <TouchableOpacity style={MenuButtonStyles.button} onPress={toggleMenu}>
        <Icons.Menu size={30} color={'#fff'} />
      </TouchableOpacity>
    </View>
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

  const NavBar = () => (
    <>
      <View style={CurvedBarStyles.container}>
        <CurvedBottomBar
          height={bottomHeight}
          width={bottomWidth}
          fill={CurvedBarStyles.fillColor}
          stroke={CurvedBarStyles.strokeColor}
          strokeWidth={CurvedBarStyles.strokeWidth}
          shadowStroke={CurvedBarStyles.shadowStroke}
          shadowStrokeWidth={CurvedBarStyles.shadowStrokeWidth}
        />
      </View>
      <View style={NavMenuStyles.wrapper}>
        {navItems.map((item, index) => {
          if (item.id === 'spacer') {
            return <View key={index} style={{flex: 1}} />; // Open middle space
          }
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavPress(item)}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3000,
              }}>
              {item.icon}
              <Text style={{fontSize: 10}}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  return (
    <View>
      <MenuButton />
      <NavBar />
    </View>
  );
};

export default NavMenu;

const CurvedBarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 2000, // this is the back, comes in from main
  },
  fillColor: '#f7f7f7',
  strokeColor: '#373d4340',
  strokeWidth: 1.5,
  shadowStroke: '#373d4320',
  shadowStrokeWidth: 4,
});

const NavMenuStyles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    padding: 5,
    zIndex: 2200, // this comes in 3rd, to hold the menu items
  },
  // cellWrapper: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignContent: 'center',
  // },
  // cellContainer: {flexDirection: 'column', padding: 5},
  // cellTop: {justifyContent: 'flex-end', alignItems: 'center'},
  // cellBottom: {flex: 1},
  // cellText: {color: '#000'},
});

const MenuButtonStyles = StyleSheet.create({
  container: {
    height: 65,
    position: 'relative',
    top: -21,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    zIndex: 2100, // this comes in second, to hold the center button
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
    zIndex: 3000, // this comes in last and is the center button
  },
});
