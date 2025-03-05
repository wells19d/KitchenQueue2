//*App.jsx

import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar, View} from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/KQ-UI/KQToast';
import Main from './Main';
import {initializeApp, getApps} from '@react-native-firebase/app';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
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
        <StatusBar barStyle="light-content" />
      </>
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <View style={{flex: 1}}>
              <StatusBar barStyle="light-content" />
              <Main />
              <Toast config={toastConfig} />
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
