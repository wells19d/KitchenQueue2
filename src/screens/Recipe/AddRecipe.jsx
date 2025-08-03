//* AddRecipe.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {BottomSheet, Button, Layout, View} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {displaySourceType} from '../../utilities/materialSource';
import {displayDropField, displayDropArray} from '../../utilities/helpers';
import {displayCuisineTypes} from '../../utilities/cuisineType';
import {displayDishTypes} from '../../utilities/dishType';
import {displayDietTypes} from '../../utilities/dietType';
import {displayMeasurements} from '../../utilities/measurements';
import IngredientForm from './IngredientForm';
import RecipeForm from './RecipeForm';
import InstructionForm from './InstructionForm';

const AddRecipe = () => {
  const core = useCoreInfo();

  // kqconsole.log('core', core);

  const [validation1, setValidation1] = useState(false);
  const [validation2, setValidation2] = useState(false);
  const [validation3, setValidation3] = useState(false);
  const [validation4, setValidation4] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const [recipeName, setRecipeName] = useState(null);
  const [sourceMaterial, setSourceMaterial] = useState(
    displayDropField(displaySourceType) ?? null,
  );
  const [source, setSource] = useState(null);
  const [sourceURL, setSourceURL] = useState(null);
  const [cuisineType, setCuisineType] = useState(
    displayDropArray(displayCuisineTypes) ?? null,
  );
  const [dishType, setDishType] = useState(
    displayDropArray(displayDishTypes) ?? null,
  );
  const [dietType, setDietType] = useState(
    displayDropArray(displayDietTypes) ?? null,
  );
  const [servings, setServings] = useState(null);
  const [prepTime, setPrepTime] = useState(null);
  const [cookTime, setCookTime] = useState(null);

  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [canPressIngredients, setCanPressIngredients] = useState(true);
  const [canPressInstructions, setCanPressInstructions] = useState(true);

  const [tempIngAmount, setTempIngAmount] = useState(null);
  const [tempIngMeasurement, setTempIngMeasurement] = useState(
    displayDropField(displayMeasurements) ?? null,
  );
  const [tempIngName, setTempIngName] = useState(null);
  const [tempNote, setTempNote] = useState(null);

  const [tempName, setTempName] = useState(null);
  const [tempSteps, setTempSteps] = useState([]);
  const [tempAction, setTempAction] = useState(null);

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
    instructions: instructions, // later addition
    notes: null, // later addition
  };

  const isValidText = value =>
    typeof value === 'string' && value.trim().length >= 2;

  useEffect(() => {
    const nameValid = isValidText(recipeName);
    const materialValid = sourceMaterial !== null;

    const sourceRequired = sourceType !== 'personal';
    const sourceValid = !sourceRequired || isValidText(source);

    const urlRequired = sourceType === 'online';
    const urlValid = !urlRequired || isValidText(sourceURL);

    const ingredientValid = ingredients?.length > 0;
    const instructionValid = instructions?.length > 0;

    // For debugging purposes
    // if (recipeName === null) console.log('Recipe Name is null');
    // if (!isValidText(recipeName)) console.log('Recipe Name is invalid');
    // if (!materialValid) console.log('Source Material is null');
    // if (!sourceValid) console.log('Source is invalid');
    // if (!urlValid) console.log('Source URL is invalid');
    // if (!ingredientValid) console.log('Ingredients are empty');
    // if (!instructionValid) console.log('Instructions are empty');

    // Show red error on name only
    setValidation1(
      recipeName === '' ||
        (typeof recipeName === 'string' && recipeName.trim() === ''),
    );

    // Disable save unless all are valid
    const allValid =
      nameValid &&
      materialValid &&
      sourceValid &&
      urlValid &&
      ingredientValid &&
      instructionValid;
    setCanSave(allValid);
  }, [
    recipeName,
    sourceMaterial,
    source,
    sourceURL,
    sourceType,
    ingredients,
    instructions,
  ]);

  const displaySourceExample = useMemo(() => {
    if (sourceMaterial?.key === 'friend') return 'Ex: Jane Doe';
    if (sourceMaterial?.key === 'family') return 'Ex: Grandma Jane';
    if (sourceMaterial?.key === 'social') return 'Ex: Facebook';
    if (sourceMaterial?.key === 'website') return 'Ex: Pinch of Yum';
    if (sourceMaterial?.key === 'app') return 'Ex: ChatGPT';
    if (sourceMaterial?.key === 'cookbook') return 'Ex: Better Homes Cook Book';
    if (sourceMaterial?.key === 'restaurant') return 'Ex: Olive Garden';
    if (sourceMaterial?.key === 'tv') return 'Ex: Iron Chef';
    if (sourceMaterial?.key === 'magazine') return 'Ex: Food Network Magazine';
    if (sourceMaterial?.key === 'package') return 'Ex: Nestle Toll House';
    if (sourceMaterial?.key === 'event') return 'Ex: Square One';
    return null;
  }, [sourceMaterial]);

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
    setTempName(null);
    setTempSteps([]);
    setTempAction(null);
    setTimeout(() => {
      setCanPressInstructions(true);
    }, 2000);
  };

  const resetForm = () => {
    setRecipeName(null);
    setSourceMaterial(displayDropField(displaySourceType));
    setSource(null);
    setSourceURL(null);
    setValidation1(false);
    setValidation2(false);
    setValidation3(false);
    setValidation4(false);
  };

  const handleSaveRecipe = () => {
    if (canSave) {
      kqconsole.log('Saving Recipe', recipeObject);
    }
  };

  return (
    <Layout
      headerTitle="Add Recipe"
      LeftButton="Back"
      RightButton={canSave ? 'Save' : ''}
      LeftAction={null}
      RightAction={handleSaveRecipe}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}
      innerViewStyles={{paddingHorizontal: 5}}
      mode="keyboard-scroll"
      hideBar>
      <RecipeForm
        recipeName={recipeName}
        setRecipeName={setRecipeName}
        validation1={validation1}
        sourceMaterial={sourceMaterial}
        setSourceMaterial={setSourceMaterial}
        displaySourceType={displaySourceType}
        validation2={validation2}
        sourceType={sourceType}
        validation3={validation3}
        validation4={validation4}
        displaySourceExample={displaySourceExample}
        source={source}
        setSource={setSource}
        sourceURL={sourceURL}
        setSourceURL={setSourceURL}
        cuisineType={cuisineType}
        setCuisineType={setCuisineType}
        displayCuisineTypes={displayCuisineTypes}
        dishType={dishType}
        setDishType={setDishType}
        displayDishTypes={displayDishTypes}
        dietType={dietType}
        setDietType={setDietType}
        displayDietTypes={displayDietTypes}
        servings={servings}
        setServings={setServings}
        prepTime={prepTime}
        setPrepTime={setPrepTime}
        cookTime={cookTime}
        setCookTime={setCookTime}
      />
      <View row>
        <View flex mv5>
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
        <View flex mv5>
          <Button
            type="outline"
            textSize="xSmall"
            size="small"
            disabled={!canPressInstructions}
            onPress={() => {
              setShowInstructions(true);
            }}>
            Add Instructions
            {instructions.length > 0 && ` (${instructions.length})`}
          </Button>
        </View>
      </View>
      <BottomSheet
        visible={showIngredients}
        onClose={handleCloseIngredients}
        snapPoints={[0.01, 0.95]}
        innerStyles={{margin: 0}}>
        <IngredientForm
          ingredients={ingredients}
          setIngredients={setIngredients}
          tempIngAmount={tempIngAmount}
          setTempIngAmount={setTempIngAmount}
          tempIngMeasurement={tempIngMeasurement}
          setTempIngMeasurement={setTempIngMeasurement}
          tempIngName={tempIngName}
          setTempIngName={setTempIngName}
          handleCloseIngredients={handleCloseIngredients}
          tempNote={tempNote}
          setTempNote={setTempNote}
        />
      </BottomSheet>

      <BottomSheet
        visible={showInstructions}
        onClose={handleCloseInstructions}
        snapPoints={[0.01, 0.95]}>
        <InstructionForm
          instructions={instructions}
          setInstructions={setInstructions}
          handleCloseInstructions={handleCloseInstructions}
          tempName={tempName}
          setTempName={setTempName}
          tempSteps={tempSteps}
          setTempSteps={setTempSteps}
          tempAction={tempAction}
          setTempAction={setTempAction}
        />
      </BottomSheet>
    </Layout>
  );
};

export default AddRecipe;
