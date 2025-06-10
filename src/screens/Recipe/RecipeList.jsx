//* RecipeList.jsx
import React, {useEffect} from 'react';
import {Layout, Text} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDeviceInfo} from '../../hooks/useHooks';
import {View} from 'react-native';

const RecipeList = () => {
  const core = useCoreInfo();
  const device = useDeviceInfo();

  useEffect(() => {
    console.log('RecipeItems mounted');
    return () => {
      console.log('RecipeItems unmounted');
    };
  }, []);

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
