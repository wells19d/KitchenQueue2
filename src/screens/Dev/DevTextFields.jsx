//* DevTextFields.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';

const DevTextFields = () => {
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
      <Text>DevTextFields</Text>
    </Layout>
  );
};

export default DevTextFields;
