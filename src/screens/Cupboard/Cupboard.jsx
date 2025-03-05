//* Cupboards.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Text, View} from 'react-native';

const Cupboards = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
      }}>
      <Text>Cupboards</Text>
    </View>
  );
};

export default Cupboards;
