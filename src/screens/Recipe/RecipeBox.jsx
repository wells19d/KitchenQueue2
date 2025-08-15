//* RecipeBox.jsx

import React from 'react';
import {View} from 'react-native';
import {Layout, Text} from '../../KQ-UI';
import {ListStyles} from '../../styles/Styles';
import {useNavigation} from '@react-navigation/native';
import {useRecipeBox} from '../../hooks/useHooks';

const RecipeBox = () => {
  const navigation = useNavigation();
  const recipeBox = useRecipeBox();
  console.log('Recipe Box Data:', recipeBox?.items);

  const handleCreateRecipe = () => {
    navigation.navigate('AddRecipe');
  };
  return (
    <Layout
      headerTitle="Recipe Box"
      LeftButton=""
      RightButton="Add"
      LeftAction={null}
      RightAction={handleCreateRecipe}
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
