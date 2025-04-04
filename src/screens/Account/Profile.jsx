//* Profile.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';

const Profile = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

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
      <Text>Profile</Text>
    </Layout>
  );
};

export default Profile;
