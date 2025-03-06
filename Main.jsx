//* Main.jsx

import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavMenu from './src/components/NavMenu';
import {useDispatch} from 'react-redux';
import {getNavMenuHeight} from './src/utilities/deviceUtils';
import Home from './src/screens/Home/Home';
import {useDeviceInfo, useProfile} from './src/hooks/useHooks';
import {setHapticFeedback} from './src/hooks/setHapticFeedback';
import Account from './src/screens/Account/Account';
import Cupboards from './src/screens/Cupboard/Cupboard';
import Shopping from './src/screens/Shopping/Shopping';

const Main = () => {
  const dispatch = useDispatch();
  const device = useDeviceInfo();
  const profile = useProfile();
  const useHaptics = setHapticFeedback();
  const Stack = createNativeStackNavigator();
  const [headerColor, setHeaderColor] = useState('#319177');
  const [screenLocation, setScreenLocation] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#373d43');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomHeight = getNavMenuHeight(device);

  useEffect(() => {
    dispatch({type: 'FETCH_DEVICE_INFO'});

    const subscription = Dimensions.addEventListener('change', () => {
      dispatch({type: 'FETCH_DEVICE_INFO'});
    });

    return () => subscription?.remove();
  }, [dispatch]);

  const toggleMenu = useCallback(() => {
    setIsSheetOpen(prev => !prev);
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
  }, [useHaptics]);

  const Navigation = () => {
    return (
      <>
        <Stack.Navigator
          screenOptions={{
            animation: 'none',
            gestureEnabled: false,
            headerBackVisible: false,
            headerShown: false,
            navigationBarColor: '#f7f7f7',
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            initialParams={{
              title: 'Home',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Home');
              },
            }}
          />
          <Stack.Screen
            name="ShoppingList"
            component={Shopping}
            initialParams={{
              title: 'Shopping List',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('ShoppingList');
              },
            }}
          />
          <Stack.Screen
            name="CupboardList"
            component={Cupboards}
            initialParams={{
              title: 'Cupboards',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('CupboardList');
              },
            }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            initialParams={{
              title: 'Account',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Account');
              },
            }}
          />
        </Stack.Navigator>
      </>
    );
  };

  return (
    <NavigationContainer>
      <SafeAreaView
        style={{flex: 1, backgroundColor: headerColor}}
        edges={['top']}>
        <View style={{flex: 1}}>
          <Navigation />
        </View>
      </SafeAreaView>
      <SafeAreaView style={{height: bottomHeight}} edges={['bottom']}>
        <NavMenu
          bottomHeight={bottomHeight}
          bottomWidth={device?.dimensions?.width}
          toggleMenu={toggleMenu}
          device={device}
        />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Main;
