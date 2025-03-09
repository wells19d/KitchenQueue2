//* Shopping.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import {Text} from '../../KQ-UI/KQText';

const Shopping = () => {
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
      <Text>Shopping</Text>
    </View>
  );
};

export default Shopping;
