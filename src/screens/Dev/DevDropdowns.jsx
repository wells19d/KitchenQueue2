//* DevDropdowns.jsx
import React, {useState} from 'react';
import {View} from 'react-native';
import {Layout, Text} from '../../KQ-UI';
import {useRoute} from '@react-navigation/native';
import {displayCategories} from '../../utilities/categories';
import {displayMeasurements} from '../../utilities/measurements';

const DevDropdowns = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const [value, setValue] = useState('');
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
      sheetOpen={false}>
      {/* <Dropdown
        label="Category"
        placeholder="Press to Select"
        value={value}
        caption="Select a Category"
        mapData={displayMeasurements}
      /> */}
    </Layout>
  );
};

export default DevDropdowns;
