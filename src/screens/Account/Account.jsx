//* Account.jsx
import React, {useMemo} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Icons} from '../../components/IconListRouter';
import Avatar from '../../components/Avatar';
import {
  useAllowedProfiles,
  useDeviceInfo,
  useProfile,
} from '../../hooks/useHooks';
import {createAvatar} from '@dicebear/core';
import {avataaars} from '@dicebear/collection';
import {setHapticFeedback} from '../../hooks/setHapticFeedback';
import {useDispatch} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {AvatarStyles} from '../../styles/Styles';

const Account = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const useHaptics = setHapticFeedback();
  const navigation = useNavigation();
  const profile = useProfile();
  const allowedProfiles = useAllowedProfiles();
  const device = useDeviceInfo();
  const dispatch = useDispatch();

  const isOwner = profile?.role === 'owner';

  const blankAvatar = createAvatar(avataaars, {
    scale: 90,
    translateY: 9,
    randomizeIds: true,
    backgroundColor: ['eeeeee'],
    accessories: [''],
    accessoriesColor: [''],
    accessoriesProbability: 100,
    clothesColor: ['666666'],
    clothing: ['graphicShirt'],
    clothingGraphic: [''],
    eyebrows: [''],
    eyes: [''],
    facialHair: [''],
    facialHairColor: [''],
    facialHairProbability: 100,
    hairColor: [''],
    mouth: [''],
    skinColor: ['c4c4c4'],
    top: [''],
  }).toString();

  const customAvatarWidth = useMemo(() => {
    switch (device?.system?.deviceSize) {
      case 'small':
        return {height: 70, width: 70};
      case 'medium':
        return {height: 75, width: 75};
      case 'large':
        return {height: 80, width: 80};
      case 'xLarge':
        return {height: 85, width: 85};
      default:
        return {height: 85, width: 85};
    }
  }, [device?.system?.deviceSize]);

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
      <View key={`profile-${index}`} style={AccountStyles.avatarCard}>
        {/* <TouchableOpacity onPress={() => console.log('View Profile')}> */}
        <Avatar
          profilePicture={profile?.pictureURL}
          viewStyles={customAvatarWidth}
        />
        {/* </TouchableOpacity> */}
        <View style={AccountStyles.avatarTitle}>
          <Text size="xSmall" font="open-7">
            {profile?.firstName}
          </Text>
          <Text size="tiny">({profile?.role})</Text>
        </View>
      </View>
    ));

    const addAvatar = (
      <View key="add-avatar" style={{padding: 0}}>
        {/* <View key="add-avatar" style={AccountStyles.avatarCard}>
        <TouchableOpacity onPress={() => console.log('Add User')}>
          <View style={[AccountStyles.avatarView, customAvatarWidth]}>
            <SvgXml xml={blankAvatar} />
          </View>
        </TouchableOpacity>
        <View style={AccountStyles.avatarTitle}>
          <Text size="xSmall">Add</Text>
          <Text size="tiny">User</Text>
        </View>
      </View> */}
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
      useScrolling={setScrolling}
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
            <BuildAvatars />
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
  midSection: {
    minHeight: 125,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
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
    elevation: 4,
  },
  collectionHeader: {
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  userSection: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
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
    elevation: 4,
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
  },
  avatarCard: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTitle: {
    paddingTop: 2,
    alignItems: 'center',
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
    elevation: 4,
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
