//* Home.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {useDeviceInfo} from '../../hooks/useHooks';
import {isHBDevice} from '../../utilities/deviceUtils';

const Home = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const device = useDeviceInfo();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
      }}>
      <Text>Home</Text>
      <Text>
        {device?.system.brand} {device?.system?.os} {device?.system?.model}{' '}
        {device?.system?.deviceSize}
      </Text>
      <Text>
        {device?.system?.model} {device?.system?.deviceSize}
      </Text>
      <Text>
        Has Bottom Button?:{' '}
        {isHBDevice(device?.system?.model) ? 'True' : 'False'}
      </Text>
    </View>
  );
};

export default Home;
