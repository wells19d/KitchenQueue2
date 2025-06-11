//* RecipeList.jsx
import React, {useState} from 'react';
import {Button, Dropdown, Input, Layout, Text} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {
  useDeviceInfo,
  useRecipeData,
  useRecipeRawData,
} from '../../hooks/useHooks';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {displayMealTypes} from '../../utilities/mealType';
import {displayCuisineTypes} from '../../utilities/cuisineType';

const RecipeList = () => {
  const core = useCoreInfo();
  const device = useDeviceInfo();
  const dispatch = useDispatch();
  const recipeFound = useRecipeData();
  const rawRecipeFound = useRecipeRawData();

  const [storedData, setStoredData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [mealType, setMealType] = useState(displayMealTypes[0]);
  const [cuisineType, setCuisineType] = useState(displayCuisineTypes[0]);

  const handleSearch = () => {
    console.log('name', searchName);
    console.log('meal', mealType);
    console.log('cuisine', cuisineType);

    dispatch({
      type: 'FETCH_RECIPE_DATA',
      payload: {
        query: searchName,
        filters: {
          mealType: mealType.value,
          cuisineType: cuisineType.value,
        },
      },
    });
  };

  console.log('recipeFound', recipeFound);
  console.log('rawRecipeFound', rawRecipeFound);

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
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text centered>Recipe</Text>
        <View style={{flex: 1}}>
          <Input
            label="Search for Recipe"
            value={searchName}
            onChangeText={setSearchName}
            // validation={validation}
            capitalize
            capitalMode="words"
          />
          <Dropdown
            label="Meal type"
            // customLabel="Custom Measurement"
            // placeholder="Select a measurement"
            value={mealType}
            setValue={setMealType}
            // caption={'Single is for individual items. Ex: Eggs'}
            mapData={displayMealTypes}
          />
          <Dropdown
            label="Cuisine Type"
            // customLabel="Custom Measurement"
            // placeholder="Select a measurement"
            value={cuisineType}
            setValue={setCuisineType}
            // caption={'Single is for individual items. Ex: Eggs'}
            mapData={displayCuisineTypes}
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{flex: 1}}>
              <Button
                // type="primary"
                size="small"
                onPress={() => handleSearch(searchName)}>
                Search
              </Button>
            </View>
            <View style={{flex: 1}}>
              <Button
                type="outline"
                size="small"
                onPress={() => {
                  setSearchName('');
                  setMealType(displayMealTypes[0]);
                  setCuisineType(displayCuisineTypes[0]);
                }}>
                Clear
              </Button>
            </View>
          </View>
          <View style={{flex: 1, marginTop: 20}}>
            <Text centered>Search Results</Text>
            {storedData && <Text>{JSON.stringify(storedData)}</Text>}
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default RecipeList;
