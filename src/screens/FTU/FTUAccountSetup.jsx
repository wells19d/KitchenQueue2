//* FTUAccountSetup.jsx

import React, {useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import {Button, ScrollView, Text} from '../../KQ-UI';
import {useAccount, useDeviceInfo} from '../../hooks/useHooks';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDispatch} from 'react-redux';

const FTUAccountSetup = () => {
  const device = useDeviceInfo();
  const dispatch = useDispatch();
  const core = useCoreInfo();
  const account = useAccount();
  // console.log('Account:', account);

  //

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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
        <ScrollView>
          <View style={styles.centeredBlock}>
            <View style={styles.topPadding}>
              <Text size="giant" font="open-7" centered italic>
                Welcome
              </Text>
            </View>
            <View style={styles.introPadding}>
              <Text size="medium" centered>
                Before you can use Kitchen Queue, you need to decide if you want
                to create your own account or join another.
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
              <Button size="medium" textSize="medium" fontType="open-7">
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

export default FTUAccountSetup;
