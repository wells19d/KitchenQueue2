//* RecipeSearch.jsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Input, Layout, Text} from '../../KQ-UI';
import {useRecipeDataLoading, useRecipesData} from '../../hooks/useHooks';
import {TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useColors} from '../../KQ-UI/KQUtilities';

import {Icons} from '../../components/IconListRouter';
import FastImage from 'react-native-fast-image';
import SelectedRecipe from './SelectedRecipe';
import {RecipeSearchStyles} from '../../styles/Styles';

const RecipeSearch = () => {
  const dispatch = useDispatch();
  const recipesFound = useRecipesData();
  const recipeLoading = useRecipeDataLoading();

  const [storedData, setStoredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCreated, setSearchCreated] = useState(true);
  const [showRecipeInfo, setShowRecipeInfo] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (
      recipesFound &&
      Array.isArray(recipesFound) &&
      recipesFound.length > 0
    ) {
      const sorted = [...recipesFound].sort(
        (a, b) => (b.ratingScore ?? 0) - (a.ratingScore ?? 0),
      );
      setStoredData(sorted);
    }
  }, [recipesFound]);

  const handleSearch = () => {
    dispatch({
      type: 'FETCH_COMMUNITY_RECIPES',
      payload: {keywords: searchName},
    });
    setSearchCreated(true);
  };

  const handleClear = () => {
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
    setSearchName('');
    setSearchCreated(false);
    setStoredData([]);
    dispatch({type: 'RESET_COMMUNITY_RECIPES'});
  };

  const handleSelectedRecipe = item => {
    setShowRecipeInfo(true);
    setSelectedRecipe(item);
  };

  const handleCloseSelectedRecipe = () => {
    setShowRecipeInfo(false);
    setSelectedRecipe(null);
  };

  // Determine if we should use one column based on ingredient length
  const [useOneColumn, setUseOneColumn] = useState(false);

  useEffect(() => {
    const hasLongIngredient = selectedRecipe?.ingredients?.some(
      ing => ing?.name?.length > 35,
    );
    setUseOneColumn(hasLongIngredient);
  }, [selectedRecipe]);
  // --- End

  const renderItem = useCallback(({item, index}) => {
    const isLeft = index % 2 === 0;
    return (
      <TouchableOpacity
        onPress={() => handleSelectedRecipe(item)}
        style={styles.itemWrapper(isLeft)}>
        <Image image={item?.image} style={styles.imageListStyles} />

        <View style={RecipeSearchStyles.listWrapper}>
          <View style={RecipeSearchStyles.listTitle}>
            <Text size="xSmall" numberOfLines={2}>
              {item?.title || ''}
            </Text>
          </View>
          <View style={RecipeSearchStyles.listSubTitleContainer}>
            <View style={RecipeSearchStyles.listReadyIn}>
              <Text size="tiny" font="open-4" kqColor="dark90">
                {item?.readyIn ? `${item.readyIn}min` : ''}
              </Text>
            </View>
            <View style={RecipeSearchStyles.listScoreContainer}>
              <View style={RecipeSearchStyles.listScoreLeft}>
                <Text size="tiny" font="open-4" kqColor="dark90">
                  {item?.ratingScore || ''}
                </Text>
              </View>

              <View style={RecipeSearchStyles.listScoreRight}>
                {!!item?.ratingScore && (
                  <Icons.Star size={12} color={useColors('dark90')} />
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const RecipesFound = useMemo(() => {
    if (searchCreated && !recipeLoading) {
      if (storedData?.length > 0) {
        return (
          <Text centered size="tiny" kqColor="dark70">
            Recipes Found: {storedData?.length || 0}
          </Text>
        );
      } else {
        return (
          <Text centered size="tiny" kqColor="dark70">
            No Recipes Found
          </Text>
        );
      }
    } else {
      return null;
    }
  }, [storedData, searchCreated, recipeLoading]);

  return (
    <Layout
      headerTitle="Recipe Search"
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 5}}
      innerViewStyles={{}}>
      <View style={RecipeSearchStyles.innerLayoutWrapper}>
        <View style={{flex: 1}}>
          <View style={RecipeSearchStyles.inputWrapper}>
            <View style={{flex: 1}}>
              <Input
                placeholder="Search Recipes"
                value={searchName}
                onChangeText={setSearchName}
                capitalize
                capitalMode="words"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                wrapperStyles={RecipeSearchStyles.wrapperStyles}
                accessoryRight={() => (
                  <TouchableOpacity
                    onPress={handleSearch}
                    style={RecipeSearchStyles.iconStyles}>
                    <Icons.Search size={25} color={useColors('dark50')} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <View>
              <View style={RecipeSearchStyles.clearButtonWrapper}>
                <TouchableOpacity
                  disabled={storedData?.length <= 0}
                  style={RecipeSearchStyles.clearButton}
                  onPress={() => handleClear()}>
                  <Icons.XCircle
                    size={30}
                    color={
                      storedData?.length <= 0
                        ? useColors('dark30')
                        : useColors('orange')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
              borderColor: useColors('dark30'),
            }}>
            {RecipesFound}
          </View>
          <View style={{flex: 1}}>
            {recipeLoading ? (
              <View style={RecipeSearchStyles.loadingWrapper}>
                <View style={RecipeSearchStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#319177" />
                </View>
                <View style={RecipeSearchStyles.loadingText}>
                  <Text size="small">Searching...</Text>
                </View>
              </View>
            ) : (
              <FlashList
                data={storedData}
                renderItem={renderItem}
                keyExtractor={item =>
                  item?.id ? item.id.toString() : `id-${index}`
                }
                estimatedItemSize={300}
                extraData={renderItem}
                numColumns={2}
              />
            )}
          </View>
        </View>
      </View>
      <SelectedRecipe
        visible={showRecipeInfo}
        selectedRecipe={selectedRecipe}
        useOneColumn={useOneColumn}
        onClose={() => handleCloseSelectedRecipe()}
      />
    </Layout>
  );
};

const styles = {
  itemWrapper: isLeft => ({
    flex: 1,
    marginLeft: isLeft ? 8 : 5,
    marginRight: isLeft ? 5 : 8,
    marginBottom: 20,
  }),
  imageListStyles: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: useColors('dark10'),
    height: 200,
    width: '100%',
    backgroundColor: useColors('white'),
  },
};

export default RecipeSearch;
