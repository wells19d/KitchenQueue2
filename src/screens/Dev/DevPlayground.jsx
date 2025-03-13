//* DevPlayground.jsx
import React from 'react';
import {View} from 'react-native';
import {Layout, Text} from '../../KQ-UI';
import {useRoute} from '@react-navigation/native';

const DevPlayground = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      innerViewStyles={{justifyContent: 'center', alignItems: 'center'}}>
      <Text>DevPlayground</Text>
    </Layout>
  );
};

export default DevPlayground;
