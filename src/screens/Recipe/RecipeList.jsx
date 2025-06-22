//* RecipeList.jsx
import React, {useCallback, useEffect, useState} from 'react';
import {Button, Input, Layout, Text} from '../../KQ-UI';
import {useRecipeDataLoading, useRecipesData} from '../../hooks/useHooks';
import {Image, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {useDispatch} from 'react-redux';
import {FlashList} from '@shopify/flash-list';
import {useColors} from '../../KQ-UI/KQUtilities';
import {capFirst} from '../../utilities/helpers';

const RecipeList = () => {
  const dispatch = useDispatch();
  const recipesFound = useRecipesData();
  const recipeLoading = useRecipeDataLoading();

  const [storedData, setStoredData] = useState([]);
  console.log('storedData', storedData);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    if (
      recipesFound &&
      Array.isArray(recipesFound) &&
      recipesFound.length > 0
    ) {
      setStoredData(recipesFound);
    }
  }, [recipesFound]);

  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = id => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSearch = () => {
    dispatch({
      type: 'FETCH_COMMUNITY_RECIPES',
      payload: {keywords: searchName},
    });
  };

  const handleClear = () => {
    setSearchName('');
    setStoredData([]);
    dispatch({type: 'RESET_COMMUNITY_RECIPES'});
  };

  const wordHelper = (word, index) => {
    if (!word) return ' ';
    if (word === 'servings') return null;
    if (typeof word !== 'string') return word;
    const lowerCaseWord = word.toLowerCase();
    const words = lowerCaseWord.split(' ');
    if (index !== undefined && index < words.length) {
      return words[index];
    }
    return words.join(' ');
  };

  const renderItem = useCallback(
    ({item}) => {
      const isExpanded = expandedIds.has(item.id);

      return (
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          style={{flex: 1, marginHorizontal: 5, minHeight: 50}}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1.5,
              borderTopWidth: 0.5,
              borderColor: useColors('dark30'),
            }}>
            <View style={{overflow: 'hidden', padding: 5}}>
              <Image
                source={{
                  uri: `https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2F${encodeURIComponent(
                    item.imageInfo.image,
                  )}?alt=media`,
                }}
                style={{
                  height: 75,
                  width: 75,
                  borderWidth: 1.5,
                  borderRadius: 8,
                  backgroundColor: useColors('white'),
                  borderColor: useColors('dark30'),
                  shadowColor: useColors('dark'),
                  shadowOffset: {width: 1, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 1.5,
                  elevation: 8,
                }}
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                flex: 1,
                padding: 5,
                justifyContent: 'center',
              }}>
              <Text size="small" numberOfLines={1}>
                {item.title}
              </Text>
              {isExpanded && (
                <View style={{marginBottom: 5}}>
                  <Text size="xTiny">
                    {item.author.displayAuthorName
                      ? item?.author.authorName
                      : `KQ Recipe provided by ${item.author.source}`}
                  </Text>
                </View>
              )}

              {!isExpanded && (
                <>
                  {item.times.readyIn && (
                    <Text size="xSmall" numberOfLines={1}>
                      Ready in about {item.times.readyIn} Minutes
                    </Text>
                  )}
                  <Text size="tiny">
                    Servings: {item.servings || 'Unknown'}
                  </Text>
                  <Text size="tiny">
                    Ingredients: {item.ingredients?.length}
                  </Text>
                  <Text size="tiny">Steps: {item.instructions?.length}</Text>
                  {/*  */}
                </>
              )}
              {isExpanded && (
                <>
                  {item.ingredients?.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        marginBottom: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 2,
                        }}></View>
                      <View
                        style={{
                          marginHorizontal: 5,
                          position: 'relative',
                          top: -1,
                        }}>
                        <Text size="xSmall" numberOfLines={1}>
                          Ingredients:
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 2,
                        }}></View>
                    </View>
                  )}
                  {item.ingredients?.map((ing, index) => (
                    <Text key={index} size="xSmall" numberOfLines={1}>
                      {ing.amount} {capFirst(wordHelper(ing.unit))}
                      {': '}
                      {capFirst(ing.name)}
                    </Text>
                  ))}
                  {item.instructions?.length > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        marginBottom: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 2,
                        }}></View>
                      <View
                        style={{
                          marginHorizontal: 5,
                          position: 'relative',
                          top: -1,
                        }}>
                        <Text size="xSmall" numberOfLines={1}>
                          Instructions:
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 2,
                        }}></View>
                    </View>
                  )}

                  {item.instructions?.map((ins, index) => (
                    <View
                      key={`${index}-${ins.step}`}
                      style={{marginVertical: 5}}>
                      <Text size="xSmall">
                        Step {ins.step + 1}: {ins.action}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [expandedIds, toggleExpand],
  );

  return (
    <Layout
      headerTitle="Recipes"
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 5}}
      innerViewStyles={{}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{flex: 1}}>
          <Input
            label="Search for Recipe"
            value={searchName}
            onChangeText={setSearchName}
            capitalize
            capitalMode="words"
          />
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <View style={{flex: 1}}>
              <Button size="small" onPress={handleSearch}>
                Search
              </Button>
            </View>
            <View style={{flex: 1}}>
              <Button type="outline" size="small" onPress={handleClear}>
                Clear
              </Button>
            </View>
          </View>
          <View style={{flex: 1}}>
            <View
              style={{
                marginTop: 5,
                marginBottom: 10,
                borderBottomWidth: 0.5,
                borderColor: useColors('dark30'),
              }}>
              <Text centered size="tiny">
                Results Returned: {storedData?.length || 0}
              </Text>
            </View>
            {recipeLoading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    paddingTop: 6,
                    paddingBottom: 3,
                    paddingLeft: 6,
                    paddingRight: 3,
                  }}>
                  <ActivityIndicator size="large" color="#319177" />
                </View>
                <View
                  style={{
                    paddingVertical: 2,
                    paddingHorizontal: 4,
                  }}>
                  <Text size="small">Searching...</Text>
                </View>
              </View>
            ) : (
              <FlashList
                data={storedData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                estimatedItemSize={70}
                extraData={expandedIds}
              />
            )}
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default RecipeList;
