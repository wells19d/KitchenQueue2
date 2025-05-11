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
import toastConfig from './src/KQ-UI/KQToast';
import Main from './Main';
import {initializeApp, getApps} from '@react-native-firebase/app';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!getApps().length) {
      initializeApp();
    }

    // Wait until app is initialized before marking ready
    const waitForAuth = setInterval(() => {
      try {
        if (auth()?.app) {
          clearInterval(waitForAuth);
          setAppReady(true);
        }
      } catch (e) {
        // Fail silently if auth isn't ready yet
      }
    }, 100);

    return () => clearInterval(waitForAuth);
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

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
              <StatusBar barStyle="light-content" />
              <Main appReady={appReady} isSplashVisible={isSplashVisible} />
              <Toast config={toastConfig} />
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;

/* 

Next Stable Trio
"react": "19.1.0",
"react-native": "0.79.0",
"@react-native-community/cli": "18.0.0"

*/
