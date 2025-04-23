//* AccountSetup.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import {Button, Input, ScrollView, Text} from '../../KQ-UI';
import {useAccount, useDeviceInfo, useInvite} from '../../hooks/useHooks';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDispatch} from 'react-redux';
import {Icons} from '../../components/IconListRouter';

const AccountSetup = () => {
  const device = useDeviceInfo();
  const dispatch = useDispatch();
  const core = useCoreInfo();
  const account = useAccount();
  const {inviteFound, inviteData, error, errorMsg1, errorMsg2} = useInvite();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showJoinAccount, setShowJoinAccount] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [accountFound, setAccountFound] = useState(false);
  const [accountFoundData, setAccountFoundData] = useState(null);
  const [accountError, setAccountError] = useState(false);
  const [accountErrorMsg1, setAccountErrorMsg1] = useState('');
  const [accountErrorMsg2, setAccountErrorMsg2] = useState('');

  useEffect(() => {
    setAccountFound(inviteFound);
    setAccountFoundData(inviteData);
    setAccountError(error);
    setAccountErrorMsg1(errorMsg1);
    setAccountErrorMsg2(errorMsg2);
  }, [inviteFound, inviteData, error, errorMsg1, errorMsg2]);

  useEffect(() => {
    if (inviteCode) {
      setAccountFound(false);
      setAccountFoundData(null);
      setAccountError(false);
      setAccountErrorMsg1('');
      setAccountErrorMsg2('');
    }
  }, [inviteCode]);

  const logoSizeConfig = useMemo(() => {
    const type = device?.system?.deviceSize;
    switch (type) {
      case 'large':
        return {scale: 1.1, activityOffset: 65};
      case 'medium':
        return {scale: 1.2, activityOffset: 60};
      case 'small':
        return {scale: 1.3, activityOffset: 55};
      case 'xSmall':
        return {scale: 1.4, activityOffset: 50};
      default:
        return {scale: 1, activityOffset: 70};
    }
  }, [device]);

  const logoWidth = 350 / logoSizeConfig.scale;
  const logoHeight = 175 / logoSizeConfig.scale;

  const handleCreateAccount = () => {
    if (isCreatingAccount) return; // 🔐 Prevent double-tap
    setIsCreatingAccount(true); // 🔒 Lock dispatch
    dispatch({
      type: 'CREATE_NEW_ACCOUNT',
      payload: {
        userID: core.userID,
        profileID: core.profileID,
      },
    });
    setTimeout(() => {
      setIsCreatingAccount(false);
    }, 30000);
  };

  const handleJoinAccount = () => {
    // this is the function that will be called when the user accepts the invitation
    // first we will search for the account using the accountID
    // then we will check and match if the joinCode match on both the account and the invite
    // if they match, we will add the profile.id to the allowedUsers array in the account
    // then we will set the account field on the profile to the accountID
    // and set the role on the profile to 'user'
    // then we will delete the invite from the account.accountInvites and on the accountInvites collection
    // we will then clear all the fields on this screen
    //most of this will been to be done with a setTimeout to allow the user to see the success message and allowing the data to be updated.
    // we will display a message to the user that they have joined the account and the will need to log back in.
    // we are then going to force the user to log out and back in so the join saga properly triggers to set the profile and account redux
  };

  const handleSearchCode = () => {
    //54A238
    const code = inviteCode.trim();

    if (code && code.length === 6) {
      console.log('Code is valid');

      dispatch({
        type: 'CHECK_JOIN_ACCOUNT',
        payload: {
          inviteCode: code,
        },
      });
    } else {
      console.log('Code is invalid');
      setAccountError(true);
      setAccountErrorMsg1('Invalid Code');
      setAccountErrorMsg2('Please check the code and try again.');
      return;
    }
  };

  const handleCancelJoin = () => {
    setAccountFound(false);
    setAccountFoundData(null);
    setAccountError(false);
    setAccountErrorMsg1('');
    setAccountErrorMsg2('');
    dispatch({
      type: 'CLEAR_INVITE_DATA',
    });
    setInviteCode('');
  };

  const ListItem = ({children}) => (
    <Text size="small" centered>
      {`\u2022`} {children}
    </Text>
  );

  return (
    <>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../images/AppLogo_350.png')}
          style={{width: logoWidth, height: logoHeight}}
        />
      </View>
      <View style={{flex: 1}}>
        {showJoinAccount ? (
          <>
            <View style={styles.centeredBlock}>
              <View style={styles.topPadding}>
                <Text size="giant" font="open-7" centered italic>
                  Welcome
                </Text>
              </View>
              <View style={styles.introPadding}>
                <Text size="medium" centered>
                  To join an account, please enter the 6 alphanumeric code
                  provided by either the account owner or the email you
                  received, then press the button below.
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
            <View>
              <Input
                label="Invitation Code"
                placeholder="Enter Here"
                value={inviteCode}
                onChangeText={setInviteCode}
                capitalize={true}
                capitalMode="characters"
                counter
                maxCount={6}
              />
              <Button disabled={accountFound} onPress={handleSearchCode}>
                Search for Account
              </Button>
            </View>
            {accountFound && (
              <View style={{margin: 30}}>
                <View style={{alignItems: 'center'}}>
                  <View style={{borderBottomWidth: 1}}>
                    <Text size="medium" font="open-7" centered>
                      Invitation Found:
                    </Text>
                  </View>
                </View>
                <View style={{marginVertical: 20}}>
                  <Text size="medium" font="open-7" centered>
                    {accountFoundData?.fromEmail}
                  </Text>
                  <Text size="medium" font="open-7" centered>
                    {accountFoundData?.fromFirst} {accountFoundData?.fromLast}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View style={{flex: 1}}>
                    <Button
                    // onPress={() => handleJoinAccount()}
                    >
                      Join Account
                    </Button>
                  </View>
                  <View style={{flex: 1}}>
                    <Button color="danger" onPress={handleCancelJoin}>
                      Cancel
                    </Button>
                  </View>
                </View>
              </View>
            )}
            {accountError && (
              <View style={{margin: 30}}>
                <Text kqColor="danger" size="large" font="open-7" centered>
                  {accountErrorMsg1}
                </Text>
                <Text size="medium" font="open-7" centered italic>
                  {accountErrorMsg2}
                </Text>
              </View>
            )}
            <Button
              type="ghost"
              onPress={() => setShowJoinAccount(false)}
              textStyle={{position: 'relative', left: -5}}>
              <Icons.ChevronLeft size={15} color={'#319177'} />
              Go Back
            </Button>
          </>
        ) : (
          <ScrollView>
            <View style={styles.centeredBlock}>
              <View style={styles.topPadding}>
                <Text size="giant" font="open-7" centered italic>
                  Welcome
                </Text>
              </View>
              <View style={styles.introPadding}>
                <Text size="medium" centered>
                  Before you can use Kitchen Queue, you need to decide if you
                  want to create your own account or join another.
                </Text>
              </View>
              <View style={styles.divider} />
            </View>

            <View style={styles.section}>
              <Text size="large" font="open-7" centered>
                New Account (Free)
              </Text>
              <View>
                <Text size="xSmall" centered>
                  (Base Features Include)
                </Text>
                <ListItem>Invite / Add 3 more users</ListItem>
                <ListItem>100 Cupboard Items</ListItem>
                <ListItem>25 Shopping Items</ListItem>
                <ListItem>10 Favorite Items{'\u002A'}</ListItem>
                <ListItem>5 Recipes Items{'\u002A'}</ListItem>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  size="medium"
                  textSize="medium"
                  fontType="open-7"
                  onPress={handleCreateAccount}>
                  Create My Account
                </Button>
              </View>
              <View style={styles.centered}>
                <View style={styles.divider} />
              </View>
            </View>

            <View style={styles.section}>
              <Text size="large" font="open-7" centered>
                Join an Account
              </Text>
              <Text size="xSmall" centered>
                (Base Features plus...)
              </Text>
              <ListItem>
                Inherited subscription limits{'\u002A'}
                {'\u002A'}
              </ListItem>

              <View style={styles.buttonWrapper}>
                <Button
                  size="medium"
                  textSize="medium"
                  fontType="open-7"
                  onPress={() => setShowJoinAccount(true)}>
                  Join an Account
                </Button>
              </View>
            </View>

            <View style={styles.footerNote}>
              <Text size="small" centered italic>
                {'\u002A'} Features are coming soon and not yet available
              </Text>
              <Text size="small" centered italic>
                {'\u002A'}
                {'\u002A'} Subscriptions are not yet available
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = {
  logoContainer: {
    alignItems: 'center',
  },
  centeredBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topPadding: {
    padding: 5,
  },
  introPadding: {
    padding: 10,
  },
  divider: {
    borderBottomWidth: 1,
    width: '80%',
    paddingBottom: 10,
    marginBottom: 20,
  },
  section: {
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  footerNote: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default AccountSetup;
