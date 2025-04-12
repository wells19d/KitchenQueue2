// CreateUser.jsx
import React from 'react';
import {Button, Input, ScrollView, Text} from '../../KQ-UI';
import {View} from 'react-native';
import {Icons} from '../../components/IconListRouter';
import {useColors} from '../../KQ-UI/KQUtilities';

const CreateUser = props => {
  const {
    isSplashVisible,
    logoSet,
    logoHeight,
    renderIcon1,
    renderIcon2,
    secureTextEntry1,
    secureTextEntry2,
    createEmail,
    setCreateEmail,
    createPassword,
    setCreatePassword,
    confirmedPassword,
    setConfirmedPassword,
    checkMode,
    passwordValidation,
    allValid,
    handleCreateUser,
    setShowLogin,
  } = props;

  const CheckListWrap = ({children}) => (
    <View
      style={{
        backgroundColor: '#fff',
        minHeight: 50,
        borderWidth: 1,
        borderColor: '#C4C4C4',
        borderRadius: 8,
        shadowColor: '#373d4380',
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
        margin: 5,
        padding: 2,
      }}>
      {children}
    </View>
  );

  const CheckListItem = ({mode, message}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 3,
        paddingVertical: 3,
      }}>
      <View style={{marginRight: 5}}>
        {mode === 'check' ? (
          <Icons.CheckFilledCircle size={15} color={useColors('primary')} />
        ) : mode === 'error' ? (
          <Icons.XCircle size={15} color={useColors('danger')} />
        ) : (
          <Icons.EmptyCircle size={15} color={useColors('dark60')} />
        )}
      </View>
      <Text
        size="xSmall"
        kqColor={
          mode === 'check' ? 'primary' : mode === 'error' ? 'danger' : 'dark60'
        }>
        {message}
      </Text>
    </View>
  );

  if (!isSplashVisible && logoSet) {
    return (
      <ScrollView
        noBar
        style={{
          flex: 1,
          marginTop: logoHeight * 1.25,
          paddingTop: 50,
          marginHorizontal: -5,
        }}>
        <Input
          placeholder="Email"
          capitalize={false}
          value={createEmail}
          onChangeText={setCreateEmail}
        />
        <Input
          placeholder="Password"
          value={createPassword}
          onChangeText={setCreatePassword}
          accessoryRight={renderIcon1}
          secureTextEntry={secureTextEntry1}
          capitalize={false}
        />
        <Input
          placeholder="Verify Password"
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          accessoryRight={renderIcon2}
          secureTextEntry={secureTextEntry2}
          capitalize={false}
        />

        <CheckListWrap>
          <CheckListItem
            mode={checkMode('email-check', createEmail)}
            message="Valid email format"
          />
          <CheckListItem
            mode={checkMode('password-length', createPassword.length)}
            message="At least 8 characters"
          />
          <CheckListItem
            mode={checkMode(
              'default',
              passwordValidation.upperCase,
              createPassword.length,
            )}
            message="An uppercase letter"
          />
          <CheckListItem
            mode={checkMode(
              'default',
              passwordValidation.lowerCase,
              createPassword.length,
            )}
            message="A lowercase letter"
          />
          <CheckListItem
            mode={checkMode(
              'default',
              passwordValidation.number,
              createPassword.length,
            )}
            message="A number"
          />
          <CheckListItem
            mode={checkMode(
              'default',
              passwordValidation.special,
              createPassword.length,
            )}
            message="A special character (@$!%*?&)"
          />
          <CheckListItem
            mode={checkMode(
              'default',
              passwordValidation.match,
              confirmedPassword.length,
            )}
            message="Passwords match"
          />
        </CheckListWrap>
        <Button
          status={allValid ? 'primary' : 'basic'}
          disabled={!allValid}
          onPress={handleCreateUser}>
          Create User
        </Button>
        <Button
          type="ghost"
          color="primary"
          underline
          onPress={() => setShowLogin(prev => !prev)}>
          Already a User?
        </Button>
      </ScrollView>
    );
  }
};

export default React.memo(CreateUser);
