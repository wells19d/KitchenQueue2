//*NavMenu.jsx
import React, {useMemo} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import CurvedBottomBar from './CurvedBottomBar';
import {Icons} from '../components/IconListRouter';
import {useNavigation} from '@react-navigation/native';
import {getNavBarHeight} from '../utilities/deviceUtils';
import {
  CurvedBarStyles,
  MenuButtonStyles,
  NavMenuStyles,
} from '../styles/Styles';
import {Text} from '../KQ-UI';

const NavMenu = props => {
  const {bottomHeight, bottomWidth, toggleMenu, device, setIsSheetOpen} = props;
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
      screen: 'CupboardList-Single',
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
    setIsSheetOpen(false);
    const allowedScreens = [
      'Home',
      'ShoppingList',
      'CupboardList-Single',
      'Account',
    ];

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
                <Text size="tiny" font="open-6">
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default NavMenu;
