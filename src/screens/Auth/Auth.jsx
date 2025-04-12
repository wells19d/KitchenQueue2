// Auth.jsx
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {Layout} from '../../KQ-UI';
import {useDeviceInfo} from '../../hooks/useHooks';
import UserLogin from './UserLogin';
import CreateUser from './CreateUser';
import {all} from 'redux-saga/effects';

function Auth(props) {
  const {bgColor, isSplashVisible} = props;
  const dispatch = useDispatch();
  const device = useDeviceInfo();

  const deviceWidth = device?.dimensions?.width;
  const deviceHeight = device?.dimensions?.height;
  const logoWidth = 350;
  const logoHeight = 175;

  const [showLogin, setShowLogin] = useState(false);
  const [logoSet, setLogoSet] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);
  const [secureTextEntry2, setSecureTextEntry2] = useState(true);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign up fields
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const logoTop = useRef(new Animated.Value(2)).current;
  const hasAnimated = useRef(false);

  const xPosition = useMemo(() => {
    if (!deviceWidth || !logoWidth) return 0;
    return deviceWidth / 2 - logoWidth / 2 - 5;
  }, [deviceWidth]);

  const yPosition = useMemo(() => {
    if (!deviceHeight || !logoHeight) return 0;
    return deviceHeight / 2.25 - logoHeight / 1.37;
  }, [deviceHeight]);

  const renderIcon = () => (
    <TouchableWithoutFeedback
      onPress={() => setSecureTextEntry(!secureTextEntry)}>
      <MCIcons
        name={secureTextEntry ? 'eye-off' : 'eye'}
        size={20}
        color={'#000'}
      />
    </TouchableWithoutFeedback>
  );
  const renderIcon1 = () => (
    <TouchableWithoutFeedback
      onPress={() => setSecureTextEntry1(!secureTextEntry1)}>
      <MCIcons
        name={secureTextEntry1 ? 'eye-off' : 'eye'}
        size={20}
        color={'#000'}
      />
    </TouchableWithoutFeedback>
  );
  const renderIcon2 = () => (
    <TouchableWithoutFeedback
      onPress={() => setSecureTextEntry2(!secureTextEntry2)}>
      <MCIcons
        name={secureTextEntry2 ? 'eye-off' : 'eye'}
        size={20}
        color={'#000'}
      />
    </TouchableWithoutFeedback>
  );

  const isValidEmail = useCallback(
    email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [],
  );

  const isValidPassword = useCallback(
    password =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password,
      ),
    [],
  );

  const canSignIn = isValidEmail(email) && isValidPassword(password);

  const passwordValidation = useMemo(() => {
    const validEmail = isValidEmail(createEmail);
    const length = createPassword.length >= 8;
    const upperCase = /[A-Z]/.test(createPassword);
    const lowerCase = /[a-z]/.test(createPassword);
    const number = /\d/.test(createPassword);
    const special = /[@$!%*?&]/.test(createPassword);
    const match =
      confirmedPassword.length > 0 && createPassword === confirmedPassword;

    return {
      validEmail,
      length,
      upperCase,
      lowerCase,
      number,
      special,
      match,
    };
  }, [createEmail, createPassword, confirmedPassword, isValidEmail]);

  const checkMode = useCallback(
    (type, value1, value2) => {
      if (type === 'password-length') {
        if (value1 >= 8) return 'check';
        if (value1 < 8 && value1 !== 0) return 'error';
        return 'uncheck';
      }
      if (type === 'email-check') {
        if (isValidEmail(value1)) return 'check';
        if (value1 && !isValidEmail(value1)) return 'error';
        return 'uncheck';
      }
      if (type === 'default') {
        if (value2 === 0) return 'uncheck';
        return value1 ? 'check' : 'error';
      }
    },
    [isValidEmail],
  );

  const allValid =
    passwordValidation.validEmail &&
    passwordValidation.length &&
    passwordValidation.upperCase &&
    passwordValidation.lowerCase &&
    passwordValidation.number &&
    passwordValidation.special &&
    passwordValidation.match;

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

  const handleSignIn = () => {
    if (canSignIn) {
      dispatch({
        type: 'LOGIN_REQUEST',
        payload: {email, password},
      });
    }
  };

  const handleCreateUser = () => {
    if (allValid) {
      console.log('handleCreateUser →', {
        email: createEmail,
        password: createPassword,
      });
    }
  };

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
        {isSplashVisible && (
          <View style={{position: 'relative', top: 70}}>
            <ActivityIndicator size="large" color="#319177" />
          </View>
        )}
        <Image
          source={require('../../images/AppLogo_350.png')}
          style={{width: 350, height: 175}}
        />
      </Animated.View>

      {showLogin ? (
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
          setShowLogin={setShowLogin}
        />
      ) : (
        <CreateUser
          isSplashVisible={isSplashVisible}
          logoSet={logoSet}
          logoHeight={logoHeight}
          renderIcon1={renderIcon1}
          renderIcon2={renderIcon2}
          secureTextEntry1={secureTextEntry1}
          secureTextEntry2={secureTextEntry2}
          createEmail={createEmail}
          setCreateEmail={setCreateEmail}
          createPassword={createPassword}
          setCreatePassword={setCreatePassword}
          confirmedPassword={confirmedPassword}
          setConfirmedPassword={setConfirmedPassword}
          checkMode={checkMode}
          passwordValidation={passwordValidation}
          handleCreateUser={handleCreateUser}
          allValid={allValid}
          setShowLogin={setShowLogin}
        />
      )}
    </Layout>
  );
}

export default Auth;
