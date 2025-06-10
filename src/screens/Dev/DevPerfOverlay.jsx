//* DevPerfOverlay.jsx
import React, {useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {getUsedMemory} from 'react-native-device-info';

const DevPerfOverlay = () => {
  const [usedMemory, setUsedMemory] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const memory = await getUsedMemory(); // returns bytes
        setUsedMemory((memory / 1024 / 1024).toFixed(1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!__DEV__) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 60,
        right: '40%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        // borderRadius: 4,
        zIndex: 9999,
      }}>
      <Text style={{color: 'white', fontSize: 12}}>Mem: {usedMemory} MB</Text>
    </View>
  );
};

export default DevPerfOverlay;
