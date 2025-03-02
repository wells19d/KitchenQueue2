//*App.jsx

import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, View} from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/components/KQToast';
import Main from './Main';
import {initializeApp, getApps} from '@react-native-firebase/app';

const App = () => {
  const [bgColor, setBgColor] = useState('#ffffff');
  if (!getApps().length) {
    initializeApp();
  }

  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <>
        <SplashScreen />
        <StatusBar barStyle="light-content" backgroundColor={bgColor} />
      </>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <StatusBar backgroundColor={bgColor} barStyle="light-content" />
            <Main bgColor={bgColor} setBgColor={setBgColor} />
            <Toast config={toastConfig} />
          </View>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
