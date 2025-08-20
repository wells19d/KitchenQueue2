//* RecipeBox.jsx

import React, {useCallback, useState} from 'react';
import {Button, Image, Layout, Text, View} from '../../KQ-UI';
import {ListStyles, RecipeSearchStyles} from '../../styles/Styles';
import {useNavigation} from '@react-navigation/native';
import {useRecipeBox} from '../../hooks/useHooks';
import {FlashList} from '@shopify/flash-list';
import {TouchableOpacity} from 'react-native';
import {Icons} from '../../components/IconListRouter';
import {useColors} from '../../KQ-UI/KQUtilities';
import {capEachWord} from '../../utilities/helpers';

const RecipeBox = () => {
  const navigation = useNavigation();
  const recipeBox = useRecipeBox();
  const recipesList = recipeBox?.items || [];
  console.log('RecipeBox recipesList:', recipesList);

  const handleCreateRecipe = () => {
    navigation.navigate('AddRecipe');
  };

  const [showRecipeInfo, setShowRecipeInfo] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSelectedRecipe = item => {
    setShowRecipeInfo(true);
    setSelectedRecipe(item);
  };

  const handleCloseSelectedRecipe = () => {
    setShowRecipeInfo(false);
    setSelectedRecipe(null);
  };

  const renderItem = useCallback(({item, index}) => {
    const isLeft = index % 2 === 0;
    return (
      <TouchableOpacity
        onPress={() => handleSelectedRecipe(item)}
        style={styles.itemWrapper(isLeft)}>
        <Image image={item.imageUri} style={styles.imageListStyles} />

        <View style={RecipeSearchStyles.listWrapper}>
          <View style={RecipeSearchStyles.listTitle}>
            <Text size="xSmall" numberOfLines={2}>
              {capEachWord(item?.title || '')}
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

  return (
    <Layout
      headerTitle="Recipe Box"
      LeftButton=""
      RightButton="Add"
      LeftAction={null}
      RightAction={handleCreateRecipe}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}>
      <View style={[RecipeSearchStyles.innerLayoutWrapper, {paddingTop: 10}]}>
        {recipesList?.length > 0 ? (
          <View flex>
            <FlashList
              data={recipesList}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item?.id ? item.id.toString() : `id-${index}`
              }
              estimatedItemSize={300}
              extraData={recipesList}
              numColumns={2}
            />
          </View>
        ) : (
          <View
            style={[
              ListStyles.viewContainer,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Text>Recipe Box is Empty</Text>
          </View>
        )}
      </View>
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

export default RecipeBox;
