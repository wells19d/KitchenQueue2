//* RecipeList.jsx
import React from 'react';
import {Layout, Text} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDeviceInfo} from '../../hooks/useHooks';
import {View} from 'react-native';

const RecipeList = () => {
  const core = useCoreInfo();
  const device = useDeviceInfo();
  return (
    <Layout
      headerTitle="Recipes"
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}
      innerViewStyles={{}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Recipe</Text>
      </View>
    </Layout>
  );
};

export default RecipeList;
