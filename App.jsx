//*App.jsx
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  StatusBar,
  View,
  Text,
  TextInput,
  PixelRatio,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/KQ-UI/KQToast';
import Main from './Main';
import {initializeApp, getApps} from '@react-native-firebase/app';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!getApps().length) {
      initializeApp();
    }

    // Wait until app is ready
    if (getApps().length) {
      setAppReady(true);
    }
  }, []);

  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};

    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps.allowFontScaling = false;

    if (Platform.OS === 'android') {
      PixelRatio.get = () => 1;
      PixelRatio.getFontScale = () => 1;
    }

    AccessibilityInfo.addEventListener('reduceMotionChanged', reduceMotion => {
      if (reduceMotion) {
        PixelRatio.get = () => 1;
        PixelRatio.getFontScale = () => 1;
      }
    });
  }, []);

  if (!appReady || isSplashVisible) {
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
            <View style={{flex: 1, backgroundColor: '#fff'}}>
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
