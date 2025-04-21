//* Account.jsx
import React, {useEffect, useMemo, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Button, Input, Layout, Modal, Text} from '../../KQ-UI';
import {ActivityIndicator, View} from 'react-native';
import {Icons} from '../../components/IconListRouter';
import {
  useAccount,
  useDeviceInfo,
  useExistingInvite,
  useProfile,
} from '../../hooks/useHooks';
import {useDispatch} from 'react-redux';
import uuid from 'react-native-uuid';
import BuildAvatar from '../../components/BuildAvatar';
import {AccountStyles} from '../../styles/Styles';
import SubAccountButton from './SubAccountButton';

const Account = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const device = useDeviceInfo();
  const dispatch = useDispatch();
  const account = useAccount();
  const existingInvite = useExistingInvite();

  const [showModal, setShowModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [invitationMsg, setInvitationMsg] = useState('');
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [displayCode, setDisplayCode] = useState('');
  const [canGenerate, setCanGenerate] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showExceeding, setShowExceeding] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setCodeGenerated(false);
    setCanGenerate(true);
    setDisplayCode('');
    setInviteEmail('');
    setEmailError(false);
    setEmailErrorMsg('');
    setInvitationMsg('');
    setShowExceeding(false);
    dispatch({type: 'CLEAR_EXISTING_INVITE'});
  };

  const showCodeModal = useMemo(() => {
    if (
      !showModal &&
      !loadingStatus &&
      ((codeGenerated && displayCode) || invitationMsg || showExceeding)
    ) {
      return true;
    }
  }, [
    codeGenerated,
    displayCode,
    showModal,
    loadingStatus,
    invitationMsg,
    showExceeding,
  ]);

  const isValidEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!inviteEmail) {
      setEmailError(false);
      setEmailErrorMsg('');
    }
  }, [inviteEmail]);

  useEffect(() => {
    if (existingInvite) {
      setCodeGenerated(true);
      setDisplayCode(existingInvite.inviteCode);
    }
  }, [existingInvite]);

  const handleInvite = () => {
    if (!canGenerate || !isValidEmail(inviteEmail)) return;

    const code = uuid.v4().slice(0, 6).toUpperCase();

    const inviteObject = {
      inviteCode: code,
      email: inviteEmail,
      fromFirst: profile?.firstName,
      fromLast: profile?.lastName,
      fromEmail: profile?.email,
      joinCode: account?.joinCode,
      toExpire: new Date().toISOString(),
    };

    setLoadingStatus(true);

    new Promise((resolve, reject) => {
      dispatch({
        type: 'QUEUE_INVITE_REQUEST',
        payload: {
          invite: inviteObject,
          accountID: account.id,
          resolve,
          reject,
        },
      });
    })
      .then(({existing, invite, exceeding}) => {
        setInviteEmail('');
        setCodeGenerated(!!invite);
        setDisplayCode(invite?.inviteCode || '');
        setLoadingStatus(false);
        setCanGenerate(true);

        if (existing) {
          setShowModal(false);
          setInvitationMsg(
            'This invitation already exists. The expiration has been updated.',
          );
        } else if (exceeding) {
          setShowModal(false);
          setShowExceeding(true);
        } else {
          setInvitationMsg('');
        }
      })
      .catch(err => {
        setEmailError(true);
        setEmailErrorMsg(err.message || 'Invite failed');
        setLoadingStatus(false);
        setCanGenerate(true);
      });
  };

  const setScrolling = useMemo(() => {
    switch (device?.system?.deviceSize) {
      case 'small':
        return true;
      case 'xSmall':
        return true;
      default:
        return false;
    }
  }, [device?.system?.deviceSize]);

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton=""
      RightButton="Logout"
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      mode="scroll-only"
      noBar={setScrolling}
      // outerViewStyles={{paddingBottom: 0}}
    >
      <View style={AccountStyles.topSection}>
        <View style={AccountStyles.sectionNav}>
          <SubAccountButton
            title="Profile"
            location="AccountProfile"
            icon={<Icons.Profile size={20} color="#373d43" />}
          />
          <SubAccountButton
            title="Settings"
            location="AccountSettings"
            icon={<Icons.Settings size={20} color="#373d43" />}
          />
          <SubAccountButton
            title="Help"
            location="AccountHelp"
            icon={<Icons.Help size={20} color="#373d43" />}
          />
        </View>
      </View>

      <View style={AccountStyles.userSection}>
        <View style={AccountStyles.sectionUsers}>
          <View style={AccountStyles.usersHeader}>
            <Text size="small" font="open-7">
              Users:
            </Text>
            <Text size="xSmall" font="open-5">
              Have up to 4 users on your account
            </Text>
          </View>
          <View style={AccountStyles.avatarWrapper}>
            <BuildAvatar setShowModal={setShowModal} />
          </View>
        </View>
      </View>
      <View style={AccountStyles.midSection}>
        <View style={AccountStyles.usersHeader}>
          <Text size="small" font="open-7">
            Collections:
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text size="xSmall">Coming Soon</Text>
        </View>
      </View>
      <View style={AccountStyles.midSection}>
        <View style={AccountStyles.usersHeader}>
          <Text size="small" font="open-7">
            Limits:
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text size="xSmall">Coming Soon</Text>
        </View>
      </View>
      <Modal
        visible={showModal}
        title={`Invite User`}
        onClose={closeModal}
        height="50%"
        width="95%"
        headerFont="open-7">
        {loadingStatus ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#319177" />
            <Text size="medium" font="open-7">
              Generating Invite...
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Input
              label="User Email"
              value={inviteEmail}
              onChangeText={text => {
                setInviteEmail(text.trim());
                setEmailError(false);
                setEmailErrorMsg('');
              }}
              validation={emailError}
              validationMessage={emailErrorMsg}
            />
            <Button onPress={handleInvite} disabled={!canGenerate}>
              Generate Invite
            </Button>
          </View>
        )}
      </Modal>
      <Modal
        visible={showCodeModal}
        title={
          showExceeding
            ? `Maxed Invitations`
            : invitationMsg
            ? `Existing Code`
            : `Code Generated`
        }
        onClose={closeModal}
        height="50%"
        width="95%"
        headerFont="open-7">
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              position: 'relative',
              top: showExceeding ? -30 : invitationMsg ? -5 : -20,
            }}>
            <View style={{marginHorizontal: 25, marginVertical: 10}}>
              <Text size="large" font="open-7" centered>
                {showExceeding
                  ? ``
                  : `Invitation Code: ${existingInvite?.inviteCode}`}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: showExceeding ? 10 : 25,
                marginVertical: showExceeding ? 0 : 10,
              }}>
              <Text size="medium" font="open-6" centered>
                {showExceeding
                  ? `Sorry, but you've reached the maximum number of invitations on your account.`
                  : invitationMsg
                  ? invitationMsg
                  : `This invitation will be sent to ${existingInvite?.email}`}
              </Text>
            </View>
            <View style={{marginHorizontal: 25, marginVertical: 10}}>
              <Text size="xSmall" font="open-5" centered italic>
                {showExceeding
                  ? `You currently have ${account?.allowedUsers?.length} of 4 users and ${account?.accountInvites?.length} active invitations on your account. Invitations can not exceed the max number of allowed users on your account.`
                  : invitationMsg
                  ? `If the user did not receive a code, have them check their spam
                  folder. You can also manually give them this code for entry.`
                  : ``}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default Account;
