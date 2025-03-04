//* Main.jsx

import {NavigationContainer} from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const Main = () => {
  const [topSAbg, setTopSAbg] = useState('#319177');
  const [bottomSAbg, setBottomSAbg] = useState('#ffffff');
  const saBottomHeight = 90 + (110 - useSafeAreaInsets().bottom) / 4;

  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1, backgroundColor: topSAbg}} edges={['top']}>
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
          {/* <Text>Main View Area</Text> */}
        </View>
      </SafeAreaView>
      <SafeAreaView
        style={{
          height: saBottomHeight,
          backgroundColor: bottomSAbg,
        }}
        edges={['bottom']}>
        {/* <Text>Button Menu</Text> */}
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Main;
