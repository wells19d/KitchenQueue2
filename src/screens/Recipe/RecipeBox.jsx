//* RecipeBox.jsx

import React from 'react';
import {View} from 'react-native';
import {Layout, Text} from '../../KQ-UI';
import {ListStyles} from '../../styles/Styles';

const RecipeBox = () => {
  return (
    <Layout
      headerTitle="Recipe Box"
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}>
      <View
        style={[
          ListStyles.viewContainer,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text>Recipe Box</Text>
      </View>
    </Layout>
  );
};

export default RecipeBox;
