//* AddRecipe.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  BottomSheet,
  Button,
  Dropdown,
  Input,
  Layout,
  MultiDropdown,
  ScrollView,
  Text,
} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {displaySourceType} from '../../utilities/materialSource';
import {
  capEachWord,
  displayCustom,
  displayCustomArray,
  formatMeasurementWithPluralRec,
} from '../../utilities/helpers';
import {displayCuisineTypes} from '../../utilities/cuisineType';
import {displayDishTypes} from '../../utilities/dishType';
import {displayDietTypes} from '../../utilities/dietType';
import {displayMeasurements} from '../../utilities/measurements';
import {Icons} from '../../components/IconListRouter';
import {useColors} from '../../KQ-UI/KQUtilities';
import {setHapticFeedback} from '../../hooks/setHapticFeedback';

const AddRecipe = () => {
  const core = useCoreInfo();
  const useHaptics = setHapticFeedback();
  // console.log('core', core);

  const [validation1, setValidation1] = useState(false);
  const [validation2, setValidation2] = useState(false);
  const [validation3, setValidation3] = useState(false);
  const [validation4, setValidation4] = useState(false);
  const [validation5, setValidation5] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const [recipeName, setRecipeName] = useState(null);
  const [sourceMaterial, setSourceMaterial] = useState(
    displayCustom(displaySourceType) ?? null,
  );
  const [source, setSource] = useState(null);
  const [sourceURL, setSourceURL] = useState(null);
  const [cuisineType, setCuisineType] = useState(
    displayCustomArray(displayCuisineTypes) ?? null,
  );
  const [dishType, setDishType] = useState(
    displayCustomArray(displayDishTypes) ?? null,
  );
  const [dietType, setDietType] = useState(
    displayCustomArray(displayDietTypes) ?? null,
  );
  const [servings, setServings] = useState(null);
  const [prepTime, setPrepTime] = useState(null);
  const [cookTime, setCookTime] = useState(null);

  const [ingredients, setIngredients] = useState([]);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showIngredients, setShowIngredients] = useState(true);
  const [canPressIngredients, setCanPressIngredients] = useState(true);
  const [canPressInstructions, setCanPressInstructions] = useState(true);

  const [tempIngAmount, setTempIngAmount] = useState(null);
  const [tempIngMeasurement, setTempIngMeasurement] = useState(
    displayCustomArray(displayMeasurements) ?? null,
  );
  const [tempIngName, setTempIngName] = useState(null);
  const [tempNote, setTempNote] = useState(null);

  const handleCloseIngredients = () => {
    setCanPressIngredients(false);
    setShowIngredients(false);
    setTempIngAmount(null);
    setTempIngMeasurement(null);
    setTempIngName(null);
    setTimeout(() => {
      setCanPressIngredients(true);
    }, 2000);
  };

  const handleCloseInstructions = () => {
    setCanPressInstructions(false);
    setShowInstructions(false);
    setTimeout(() => {
      setCanPressInstructions(true);
    }, 2000);
  };

  const sourceType = useMemo(() => {
    if (!sourceMaterial) {
      setSource(null);
      return null;
    }

    if (sourceMaterial?.key === 'personal') {
      setSource('personal');
      return 'personal';
    }

    if (sourceMaterial?.key === 'friend' || sourceMaterial?.key === 'family') {
      setSource(null);
      return 'private';
    }

    if (
      sourceMaterial?.key === 'social' ||
      sourceMaterial?.key === 'website' ||
      sourceMaterial?.key === 'app'
    ) {
      setSource(null);
      return 'online';
    }

    if (
      sourceMaterial?.key === 'cookbook' ||
      sourceMaterial?.key === 'restaurant' ||
      sourceMaterial?.key === 'tv' ||
      sourceMaterial?.key === 'magazine' ||
      sourceMaterial?.key === 'package' ||
      sourceMaterial?.key === 'event'
    ) {
      setSource(null);
      return 'published';
    }

    return null;
  }, [sourceMaterial]);

  const recipeObject = {
    title: recipeName?.toLowerCase().trim(),
    sourceMaterial: sourceMaterial?.key,
    source: source?.toLowerCase().trim(),
    sourceURL: sourceURL?.trim().toLowerCase().replace(/\s+/g, ''),
    authorOnlineName: core?.onlineName,
    authorFirstName: core?.firstName,
    authorLastName: core?.lastName,
    authorID: core?.userID,
    adminEdit: true,
    cuisineType: cuisineType?.map(c => c.value),
    dishType: dishType?.map(c => c.value),
    seasonal: null, // later addition
    occasions: null, // later addition
    displayAuthorName: false, // later addition - for shared recipes
    publicAuthor: false, // later addition - for shared recipes
    recipeShared: false, // later addition - for shared recipes
    servings: servings ? Number(servings) : null,
    prepTime: prepTime ? Number(prepTime) : null,
    cookTime: cookTime ? Number(cookTime) : null,
    readyIn: prepTime && cookTime ? Number(prepTime) + Number(cookTime) : null,
    ingredients: ingredients, // later addition
  };

  console.log('recipeObject', recipeObject);

  useEffect(() => {
    if (recipeName === null) {
      setValidation1(false);
      setCanSave(false);
    } else if (recipeName === '') {
      setValidation1(true);
      setCanSave(false);
    } else {
      setValidation1(false);
      setCanSave(true);
    }
  }, [recipeName]);

  const resetForm = () => {
    setRecipeName(null);
    setSourceMaterial(displayCustom(displaySourceType));
    setSource(null);
    setSourceURL(null);
    setValidation1(false);
    setValidation2(false);
    setValidation3(false);
    setValidation4(false);
    setValidation5(false);
  };

  const handleAddIngredient = () => {
    let newObject = {
      amount: tempIngAmount ? Number(tempIngAmount) : null,
      measurement: tempIngMeasurement?.key,
      name: tempIngName?.toLowerCase().trim(),
      note: tempNote ? tempNote.trim() : null,
    };
    console.log('newObject', newObject);
    setIngredients(prev => [...prev, newObject]);
    setTempIngAmount(null);
    setTempIngMeasurement(null);
    setTempIngName(null);
    setTempNote(null);
  };

  const moveIngredient = (fromIndex, toIndex) => {
    setIngredients(prev => {
      const updated = [...prev];
      const item = updated.splice(fromIndex, 1)[0];
      updated.splice(toIndex, 0, item);
      return updated;
    });
  };

  return (
    <Layout
      headerTitle="Add Recipe"
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}
      innerViewStyles={{paddingHorizontal: 5}}
      mode="static"
      hideBar>
      <Input
        required
        label="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
        // validation={validation1}
        // validationMessage="Recipe Name is required"
        capitalize
        capitalMode="words"
      />
      <Dropdown
        required
        label="Source Material"
        placeholder="Select a Material Type"
        value={sourceMaterial}
        setValue={setSourceMaterial}
        caption={'Where the recipe is from'}
        mapData={displaySourceType}
        // validation={validation2}
        // validationMessage="Source Material is required"
      />
      {sourceType !== 'personal' && sourceType !== null && (
        <Input
          required
          label="Source Name"
          value={source}
          onChangeText={setSource}
          // validation={sourceType !== 'personal' ? validation3 : null}
          // validationMessage="Source Name is required"
          capitalize
          capitalMode="words"
          caption={
            sourceType === 'private' && 'Not Displayed Publicly. Reference Only'
          }
        />
      )}
      {sourceType === 'online' && sourceType !== null && (
        <Input
          required={sourceType === 'online'}
          label="Source URL"
          placeholder="https://www.example.com"
          value={sourceURL}
          onChangeText={setSourceURL}
          // validation={sourceType === 'online' ? validation4 : null}
          // validationMessage="Source URL is required"
          capitalize
          capitalMode="none"
        />
      )}

      <MultiDropdown
        required
        label="Cuisine Type"
        placeholder="Select a Cuisine Type"
        caption="Ex: Italian, Mexican, etc."
        value={cuisineType}
        setValue={setCuisineType}
        mapData={displayCuisineTypes}
        // validation={validation2}
        // validationMessage="Source Material is required"
      />
      <MultiDropdown
        required
        label="Dish Type"
        placeholder="Select a Dish Type"
        value={dishType}
        setValue={setDishType}
        mapData={displayDishTypes}
        // validation={validation2}
        // validationMessage="Source Material is required"
      />
      <MultiDropdown
        // required
        label="Diet Type"
        placeholder="Select a Diet Type"
        value={dietType}
        setValue={setDietType}
        mapData={displayDietTypes}
        // validation={validation2}
        // validationMessage="Source Material is required"
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Input
            label="Servings"
            caption="Ex: 4 serv."
            value={servings}
            onChangeText={setServings}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <Input
            label="Prep Time"
            caption="Ex: 15 Min"
            value={prepTime}
            onChangeText={setPrepTime}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <Input
            label="Cook Time"
            caption="Ex: 15 Min"
            value={cookTime}
            onChangeText={setCookTime}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1, marginVertical: 5}}>
          <Button
            type="outline"
            textSize="xSmall"
            size="small"
            disabled={!canPressIngredients}
            onPress={() => {
              setShowIngredients(true);
            }}>
            Add Ingredients
            {ingredients.length > 0 && ` (${ingredients.length})`}
          </Button>
        </View>
        <View style={{flex: 1, marginVertical: 5}}>
          <Button
            type="outline"
            textSize="xSmall"
            size="small"
            disabled={!canPressInstructions}
            onPress={() => {
              setShowInstructions(true);
            }}>
            Add Instructions
          </Button>
        </View>
      </View>
      <BottomSheet
        visible={showIngredients}
        onClose={handleCloseIngredients}
        snapPoints={[0.01, 0.925]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Input
              labelStyles={{fontSize: 13}}
              label="Amount"
              value={tempIngAmount}
              onChangeText={setTempIngAmount}
              keyboardType="numeric"
              // capitalMode="words"
              size="tiny"
            />
          </View>
          <View style={{flex: 1}}>
            <Dropdown
              required
              label="Measurement"
              labelStyles={{fontSize: 13}}
              // customLabel="Custom Measurement"
              // placeholder="Select a measurement"
              value={tempIngMeasurement}
              setValue={setTempIngMeasurement}
              mapData={displayMeasurements}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Input
              label="Name"
              labelStyles={{fontSize: 13}}
              value={tempIngName}
              onChangeText={setTempIngName}
              capitalMode="words"
            />
          </View>
        </View>
        {/* 
        Note sure if we need this, but leaving it for now
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Input
              label="Note"
              caption="Optional note for the ingredient"
              labelStyles={{fontSize: 13}}
              value={tempNote}
              onChangeText={setTempNote}
              capitalMode="sentences"
              counter
              maxCount={100}
              multiHeight="small"
            />
          </View>
        </View> */}
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View>
            <Button
              type="outline"
              color="primary"
              textSize="xSmall"
              size="tiny"
              onPress={() => handleAddIngredient()}>
              Add Item
            </Button>
          </View>
          <View style={{flex: 1}}></View>
          <View>
            <Button
              textSize="xSmall"
              size="tiny"
              onPress={handleCloseIngredients}>
              Finished
            </Button>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            marginTop: 10,
            backgroundColor: '#fff',
          }}>
          {ingredients.length > 0 ? (
            ingredients.map((ing, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 5,
                }}>
                {/* Delete button */}
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={() => {
                    useHaptics(core?.userSettings?.hapticStrength || 'light');
                    setIngredients(prev => prev.filter((_, i) => i !== index));
                  }}>
                  <Icons.XCircle size={20} color={useColors('danger')} />
                </TouchableOpacity>

                {/* Ingredient text */}
                <View style={{marginRight: 5, flex: 1}}>
                  <Text size="xSmall" font="open-6">
                    {formatMeasurementWithPluralRec(
                      ing.amount,
                      ing.measurement,
                      ing.name,
                    )}
                  </Text>
                  {ing.note && (
                    <Text size="tiny" font="open-5" italic>
                      ** {ing.note}
                    </Text>
                  )}
                </View>

                {/* Reorder arrows */}
                <View style={{flexDirection: 'row'}}>
                  {index > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        useHaptics(
                          core?.userSettings?.hapticStrength || 'light',
                        );
                        moveIngredient(index, index - 1);
                      }}
                      style={{
                        marginRight: 5,
                        borderWidth: 1,
                        width: 30,
                        height: 25,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: useColors('dark60'),
                      }}>
                      <Icons.ChevronUp size={16} color={useColors('dark60')} />
                    </TouchableOpacity>
                  )}
                  {index < ingredients.length - 1 && (
                    <TouchableOpacity
                      style={{
                        marginRight: 5,
                        borderWidth: 1,
                        width: 30,
                        height: 25,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: useColors('dark60'),
                      }}
                      onPress={() => {
                        useHaptics(
                          core?.userSettings?.hapticStrength || 'light',
                        );
                        moveIngredient(index, index + 1);
                      }}>
                      <Icons.ChevronDown
                        size={16}
                        color={useColors('dark60')}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Text size="xSmall" font="open-6" centered>
                No ingredients added yet.
              </Text>
            </View>
          )}
        </ScrollView>
        {/* <Text>showIngredients</Text>
        <Button
          type="outline"
          textSize="xSmall"
          size="small"
          onPress={handleCloseIngredients}>
          Close
        </Button> */}
      </BottomSheet>

      <BottomSheet
        visible={showInstructions}
        onClose={handleCloseInstructions}
        snapPoints={[0.01, 0.925]}></BottomSheet>
    </Layout>
  );
};

export default AddRecipe;
