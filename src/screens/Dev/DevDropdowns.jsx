//* DevDropdowns.jsx
import React, {useState} from 'react';
import {View} from 'react-native';
import {Dropdown, Input, Layout, Text} from '../../KQ-UI';
import {useRoute} from '@react-navigation/native';
import {displayCategories} from '../../utilities/categories';
import {displayMeasurements} from '../../utilities/measurements';

const DevDropdowns = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const [value, setValue] = useState(null);
  console.log('value:', value);
  const [value2, setValue2] = useState('');

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
      <Input
        label="Item Name"
        placeholder="Enter Item Name"
        value={value2}
        onChangeText={setValue2}
        capitalize={false}
        capitalMode="words"
        caption="Enter Item"
      />
      <Dropdown
        label="Category"
        placeholder="Press to Select"
        value={value}
        setValue={setValue}
        caption="Select a Category"
        mapData={displayMeasurements}
      />
    </Layout>
  );
};

export default DevDropdowns;
