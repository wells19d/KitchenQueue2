//* UserLogin.jsx
import React from 'react';
import {Button, Input, ScrollView} from '../../KQ-UI';

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
    setShowLogin,
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
        <Button
          type="ghost"
          color="primary"
          underline
          onPress={() => setShowLogin(prev => !prev)}>
          New User?
        </Button>
      </ScrollView>
    );
  }
};

export default React.memo(UserLogin);
