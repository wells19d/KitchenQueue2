//* Auth.jsx
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {Button, Input, Layout} from '../../KQ-UI';
import {useDeviceInfo} from '../../hooks/useHooks';

function Auth(props) {
  const {bgColor} = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const dispatch = useDispatch();
  const device = useDeviceInfo();

  const logoPosition = useRef(
    new Animated.Value(Platform.OS === 'ios' ? 330 : 370),
  ).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const screenHeight = device?.dimensions?.height || 800; // Default fallback
    const deviceSize = device?.system?.deviceSize || 'unknown';
    const os = device?.system?.os || 'unknown';

    const getLogoFinalPosition = (screenHeight, deviceSize, os) => {
      switch (`${deviceSize}-${os}`) {
        case 'xSmall-iOS':
          return screenHeight * 0.1;
        case 'xSmall-Android':
          return screenHeight * 0.12;

        case 'small-iOS':
          return screenHeight * 0.12;
        case 'small-Android':
          return screenHeight * 0.14;

        case 'medium-iOS':
          return screenHeight * 0.14;
        case 'medium-Android':
          return screenHeight * 0.16;

        case 'large-iOS':
          return screenHeight * 0.16;
        case 'large-Android':
          return screenHeight * 0.18;

        case 'xLarge-iOS': // iPhone Pro Max / Large Tablets
          return screenHeight * 0.18;
        case 'xLarge-Android': // Android XL devices
          return screenHeight * 0.2;

        default:
          return screenHeight * 0.18; // Fallback for unknown sizes
      }
    };

    const finalPosition = getLogoFinalPosition(screenHeight, deviceSize, os);

    Animated.timing(logoPosition, {
      toValue: finalPosition,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);
  }, [device]); // Recalculate when `device` changes

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

  const logo = require('../../images/AppLogo_350.png');

  return (
    <Layout useHeader={false} innerViewStyles={{justifyContent: 'center'}}>
      <StatusBar backgroundColor={bgColor} barStyle="light-content" />
      <Animated.View
        style={{
          position: 'absolute',
          top: logoPosition,
          width: '100%',
          alignItems: 'center',
        }}>
        <Image source={logo} />
      </Animated.View>
      <Animated.View
        style={{
          opacity: formOpacity,
          transform: [{translateY: formTranslateY}],
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
      </Animated.View>
    </Layout>
  );
}

export default Auth;
