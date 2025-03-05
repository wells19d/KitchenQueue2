//* Main.jsx

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavMenu from './src/components/NavMenu';
import {useDispatch} from 'react-redux';
import {getNavMenuHeight} from './src/utilities/deviceUtils';
import Home from './src/screens/Home/Home';
import {useDeviceInfo} from './src/hooks/useHooks';

const Main = () => {
  const dispatch = useDispatch();
  const device = useDeviceInfo();
  const Stack = createNativeStackNavigator();
  const [headerColor, setHeaderColor] = useState('#319177');
  const [screenLocation, setScreenLocation] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bottomBgColor, setBottomBgColor] = useState('#f7f7f7');
  const [textColor, setTextColor] = useState('#373d43');
  const bottomHeight = getNavMenuHeight(device);

  useEffect(() => {
    dispatch({type: 'FETCH_DEVICE_INFO'});

    const subscription = Dimensions.addEventListener('change', () => {
      dispatch({type: 'FETCH_DEVICE_INFO'});
    });

    return () => subscription?.remove();
  }, [dispatch]);

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
      <SafeAreaView
        style={{
          height: bottomHeight,
          // backgroundColor: bottomBgColor,
        }}
        edges={['bottom']}>
        <NavMenu
          bottomBgColor={bottomBgColor}
          bottomHeight={bottomHeight}
          bottomWidth={device?.dimensions?.width}
        />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Main;
