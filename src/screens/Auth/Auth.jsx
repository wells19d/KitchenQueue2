//* Auth.jsx
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {Button, Input, Layout, ScrollView} from '../../KQ-UI';
import {useDeviceInfo} from '../../hooks/useHooks';

const UserLogin = props => {
  const {
    isSplashVisible,
    logoSet,
    logoHeight,
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    canSignIn,
    renderIcon,
    secureTextEntry,
  } = props;
  if (!isSplashVisible && logoSet) {
    return (
      <ScrollView
        noBar
        style={{
          flex: 1,
          marginTop: logoHeight * 1.25,
          paddingTop: logoHeight,
          marginHorizontal: -5,
        }}>
        <Input
          placeholder="Email"
          capitalize={false}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          accessoryRight={renderIcon}
          secureTextEntry={secureTextEntry}
          capitalize={false}
        />
        <Button
          status={canSignIn ? 'primary' : 'basic'}
          onPress={handleSignIn}
          disabled={!canSignIn}>
          Sign In
        </Button>
      </ScrollView>
    );
  }
};

function Auth(props) {
  const {bgColor, isSplashVisible} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const dispatch = useDispatch();
  const device = useDeviceInfo();

  const deviceWidth = device?.dimensions?.width;
  const deviceHeight = device?.dimensions?.height;

  const logoWidth = 350;
  const logoHeight = 175;

  const xPosition = useMemo(() => {
    if (!deviceWidth || !logoWidth) return 0;
    return deviceWidth / 2 - logoWidth / 2 - 5;
  }, [deviceWidth]);

  const yPosition = useMemo(() => {
    if (!deviceHeight || !logoHeight) return 0;
    return deviceHeight / 2.25 - logoHeight / 1.37;
  }, [deviceHeight]);

  const [logoSet, setLogoSet] = useState(false);
  const logoTop = useRef(new Animated.Value(2)).current;
  const hasAnimated = useRef(false); // Prevent double animation

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <MCIcons
        name={secureTextEntry ? 'eye-off' : 'eye'}
        size={20}
        color={'#000'}
      />
    </TouchableWithoutFeedback>
  );

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password => password.length >= 8;
  const canSignIn = isValidEmail(email) && isValidPassword(password);

  const handleSignIn = () => {
    if (canSignIn) {
      dispatch({
        type: 'LOGIN_REQUEST',
        payload: {email, password},
      });
    }
  };

  useEffect(() => {
    if (!isSplashVisible && !hasAnimated.current) {
      hasAnimated.current = true;

      Animated.timing(logoTop, {
        toValue: -(deviceHeight / 2.25 - logoHeight),
        duration: 800,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.ease),
      }).start(() => {
        setLogoSet(true);
      });
    }
  }, [isSplashVisible]);

  return (
    <Layout useHeader={false} mode="keyboard-static">
      <StatusBar backgroundColor={bgColor} barStyle="light-content" />
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: yPosition,
          left: xPosition,
          zIndex: 999,
          transform: [{translateY: logoTop}],
        }}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {isSplashVisible && (
            <View style={{position: 'relative', top: 70}}>
              <ActivityIndicator size="large" color="#319177" />
            </View>
          )}
          <Image
            source={require('../../images/AppLogo_350.png')}
            style={{width: 350, height: 175}}
          />
        </View>
      </Animated.View>
      <UserLogin
        isSplashVisible={isSplashVisible}
        logoSet={logoSet}
        logoHeight={logoHeight}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignIn={handleSignIn}
        canSignIn={canSignIn}
        renderIcon={renderIcon}
        secureTextEntry={secureTextEntry}
      />
    </Layout>
  );
}

export default Auth;
