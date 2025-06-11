//* RecipeList.jsx
import React, {useEffect, useState} from 'react';
import {Button, Layout, Text} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {
  useDeviceInfo,
  useFoodData,
  useFoodDataError,
  useFoodDataLoading,
} from '../../hooks/useHooks';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

const RecipeList = () => {
  const core = useCoreInfo();
  const device = useDeviceInfo();
  const dispatch = useDispatch();

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
