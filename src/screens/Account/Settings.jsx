//* Settings.jsx
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Layout, ScrollView, Text} from '../../KQ-UI';
import {ScreenStyles} from '../../styles/Styles';
import {useProfile} from '../../hooks/useHooks';
import {View} from 'react-native';
import TellMeButton from '../../components/TellMeButton';

const Settings = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const navigation = useNavigation();

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton="Back"
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      // outerViewStyles={{paddingBottom: 0}}
    >
      <View flex={1} style={ScreenStyles.viewContainer}>
        <View style={ScreenStyles.viewInnerTopContainer}>
          <Text centered>Customize settings for...</Text>
        </View>
        <ScrollView contentContainerStyle={ScreenStyles.scrollContainer}>
          <TellMeButton
            profile={profile?.userSettings?.hapticStrength}
            action={() => navigation.navigate('Vibrations')}
            tt1="Vibrations"
            tt2="Adjust the vibration strength of actions."
          />
          <TellMeButton
            profile={profile?.userSettings?.hapticStrength}
            action={() => navigation.navigate('ItemDisplay')}
            tt1="Item Display"
            tt2="Change the information ordered in the lists."
          />
          {/* <TellMeButton
            profile={profile?.userSettings?.hapticStrength}
            action={() => navigation.navigate('AdvancedFields')}
            tt1="Advanced Fields"
            tt2="Enable or Disable advanced fields."
          /> */}
          {/* 
        //TODO: Add these settings later
      <TellMeButton
        action={() => navigation.navigate('DefaultView')}
        tt1="Default View Mode"
        tt2="Default to Group or Single view in Cupboards."
      /> */}
        </ScrollView>
      </View>
    </Layout>
  );
};

export default Settings;
