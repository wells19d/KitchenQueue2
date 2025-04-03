//* Account.jsx
import React, {useMemo} from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';
import {TouchableOpacity, View} from 'react-native';
import {Icons} from '../../components/IconListRouter';
import Avatar from '../../components/Avatar';
import {
  useAllowedProfiles,
  useDeviceInfo,
  useProfile,
} from '../../hooks/useHooks';
import {createAvatar} from '@dicebear/core';
import {avataaars} from '@dicebear/collection';
import {SvgXml} from 'react-native-svg';

const Account = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const allowedProfiles = useAllowedProfiles();
  const profile = useProfile();
  const isOwner = profile?.role === 'owner';
  const device = useDeviceInfo();

  const blankAvatar = createAvatar(avataaars, {
    scale: 90,
    translateY: 9,
    randomizeIds: true,
    backgroundColor: ['eeeeee'],
    accessories: [' '],
    accessoriesColor: [' '],
    accessoriesProbability: 100,
    clothesColor: ['666666'],
    clothing: ['graphicShirt'],
    clothingGraphic: [''],
    eyebrows: [''],
    eyes: [''],
    facialHair: [' '],
    facialHairColor: [' '],
    facialHairProbability: 100,
    hairColor: [''],
    mouth: [''],
    skinColor: ['c4c4c4'],
    top: [''],
  }).toString();

  const customAvatarWidth = useMemo(() => {
    switch (device?.system?.deviceSize) {
      case 'small':
        return {height: 65, width: 65};
      case 'medium':
        return {height: 70, width: 70};
      case 'large':
        return {height: 80, width: 80};
      case 'xLarge':
        return {height: 85, width: 85};
      default:
        return {height: 100, width: 100};
    }
  }, [device?.system?.deviceSize]);

  const SubAccountButton = props => {
    const {location, icon, title} = props;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={AccountStyles.subWrapper}
          onPress={() => {
            navigation.navigate(location);
            useHaptics(profile?.userSettings?.hapticStrength || 'light');
          }}>
          <View style={AccountStyles.subIcon}>{icon}</View>
          <View style={AccountStyles.subTextWrap}>
            <Text size="small" font="open-7">
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const BuildAvatars = () => {
    const showAddAvatar = isOwner && allowedProfiles?.length < 4;

    const avatars = allowedProfiles?.map((profile, index) => (
      <View key={`profile-${index}`} style={{padding: 5}}>
        <TouchableOpacity onPress={() => console.log('View Profile')}>
          <Avatar
            profilePicture={profile?.pictureURL}
            viewStyles={customAvatarWidth}
          />
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text size="xSmall">{profile?.firstName}</Text>
          <Text size="tiny">{profile?.role}</Text>
        </View>
      </View>
    ));

    const addAvatar = (
      <View key="add-avatar" style={{padding: 5}}>
        <TouchableOpacity onPress={() => console.log('Add User')}>
          <View style={[AccountStyles.avatarView, customAvatarWidth]}>
            <SvgXml xml={blankAvatar} />
          </View>
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text size="xSmall">Add</Text>
          <Text size="tiny">User</Text>
        </View>
      </View>
    );

    return [...avatars, ...(showAddAvatar ? [addAvatar] : [])];
  };

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
      // outerViewStyles={{paddingBottom: 0}}
    >
      <View style={AccountStyles.topSection}>
        <View style={AccountStyles.sectionNav}>
          <SubAccountButton
            title="Profile"
            location="AccountProfile"
            icon={<Icons.Profile size={22.5} color="#373d43" />}
          />
          <SubAccountButton
            title="Settings"
            location="AccountSettings"
            icon={<Icons.Settings size={22.5} color="#373d43" />}
          />
          <SubAccountButton
            title="Help"
            location="AccountHelp"
            icon={<Icons.Help size={22.5} color="#373d43" />}
          />
        </View>
      </View>
      <View style={AccountStyles.bottomSection}>
        <View style={AccountStyles.sectionUsers}>
          <View style={AccountStyles.usersHeader}>
            <Text size="small">Users:</Text>
            <Text size="xSmall" font="open-5">
              Have up to 4 users on your account
            </Text>
          </View>
          <View style={AccountStyles.avatarWrapper}>
            <BuildAvatars />
          </View>
        </View>
      </View>
    </Layout>
  );
};

const AccountStyles = {
  topSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 5,
  },
  bottomSection: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    flex: 1,
  },
  sectionNav: {flexDirection: 'row'},
  sectionUsers: {
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#373d4380',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    paddingBottom: 15,
    flex: 1,
  },
  usersHeader: {
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  avatarWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 5,
  },
  subWrapper: {
    height: 65,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#373d4380',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    marginHorizontal: 5,
  },
  subIcon: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
  },
  subTextWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  avatarView: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 50,
    overflow: 'hidden',
  },
};

export default Account;
