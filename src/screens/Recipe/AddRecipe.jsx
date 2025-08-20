//* AddRecipe.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {BottomSheet, Button, Input, Layout, Text, View} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import {displaySourceType} from '../../utilities/materialSource';
import {displayDropField, displayDropArray} from '../../utilities/helpers';
import {displayCuisineTypes} from '../../utilities/cuisineType';
import {displayDishTypes} from '../../utilities/dishType';
import {displayDietTypes} from '../../utilities/dietType';
import {displayMeasurements} from '../../utilities/measurements';
import {normalizeTitleForKeywords} from '../../utilities/normalizeTitle';
import UploadPicture from './UploadPicture';
import IngredientForm from './Forms/IngredientForm';
import InstructionForm from './Forms/InstructionForm';
import RecipeForm from './Forms/RecipeForm';
import {useDispatch} from 'react-redux';
import {myRecipe} from '../../../myRecipe';

const AddRecipe = () => {
  const core = useCoreInfo();
  console.log('Core Info:', core);
  const dispatch = useDispatch();
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
  const [aboutRecipe, setAboutRecipe] = useState(null);

  const [finalImage, setFinalImage] = useState(null);

  const [showInstructions, setShowInstructions] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const [canPressIngredients, setCanPressIngredients] = useState(true);
  const [canPressInstructions, setCanPressInstructions] = useState(true);

  const [showUploadPicture, setShowUploadPicture] = useState(false);
  const [showAboutRecipe, setShowAboutRecipe] = useState(false);

  const [canPressUploadPicture, setCanPressUploadPicture] = useState(true);
  const [canPressAboutRecipe, setCanPressAboutRecipe] = useState(true);

  const [tempIngAmount, setTempIngAmount] = useState(null);
  const [tempIngMeasurement, setTempIngMeasurement] = useState(
    displayDropField(displayMeasurements) ?? null,
  );
  const [tempIngName, setTempIngName] = useState(null);
  const [tempNote, setTempNote] = useState(null);

  const [tempName, setTempName] = useState(null);
  const [tempSteps, setTempSteps] = useState([]);
  const [tempAction, setTempAction] = useState(null);

  const [sourceType, setSourceType] = useState(null);

  const [keywords, setKeywords] = useState(null);
  const [pictureName, setPictureName] = useState(null);

  useEffect(() => {
    if (!sourceMaterial) {
      setSource(null);
      setSourceType(null);
      return;
    }

    if (sourceMaterial?.key === 'personal') {
      setSource('personal');
      setSourceType('personal');
      return;
    }

    if (['friend', 'family'].includes(sourceMaterial?.key)) {
      setSource(null);
      setSourceType('private');
      return;
    }

    if (['social', 'website', 'app'].includes(sourceMaterial?.key)) {
      setSource(null);
      setSourceType('online');
      return;
    }

    if (
      ['cookbook', 'restaurant', 'tv', 'magazine', 'package', 'event'].includes(
        sourceMaterial?.key,
      )
    ) {
      setSource(null);
      setSourceType('published');
      return;
    }

    setSourceType(null);
  }, [sourceMaterial]);

  useMemo(() => {
    if (!recipeName) return;

    const normalized = normalizeTitleForKeywords(recipeName);
    setKeywords(normalized);

    const slug = normalized.slice(1).join('-');
    const prefix = core?.profileID || core?.userID;

    setPictureName(`${prefix}-${slug}`);
  }, [recipeName]);

  const recipeObject = {
    title: recipeName?.toLowerCase().trim(),
    sourceMaterial: sourceMaterial?.key ?? null,
    source: source?.toLowerCase().trim(),
    sourceURL: sourceURL?.trim().toLowerCase().replace(/\s+/g, '') ?? null,
    credit: core?.onlineName,
    authorOnlineName: core?.onlineName,
    authorFirstName: core?.firstName,
    authorLastName: core?.lastName,
    authorID: core?.userID,
    accountID: core?.accountID,
    adminEdit: true,
    cuisines: cuisineType?.map(c => c.value),
    dishTypes: dishType?.map(c => c.value),
    diets: dietType?.map(c => c.value),
    displayAuthorName: false, // later addition - for shared recipes
    publicAuthor: false, // later addition - for shared recipes
    recipeShared: false, // later addition - for shared recipes
    sharedStatus: null, // later addition - for shared recipes // for admin approvals
    servings: servings ? Number(servings) : null,
    prepTime: prepTime ? Number(prepTime) : null,
    cookTime: cookTime ? Number(cookTime) : null,
    readyIn: prepTime && cookTime ? Number(prepTime) + Number(cookTime) : null,
    ingredients: ingredients,
    instructions: instructions,
    image: finalImage?.name ?? null,
    imageUri: finalImage
      ? `https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2F${finalImage?.name}?alt=media`
      : null,
    pictureApproved: true,
    ingredientList: ingredients?.map(ing => ing.name?.toLowerCase().trim()),
    isArchived: false,
    // keywords: normalizeTitleForKeywords(recipeName),
    keywords: keywords ?? null,
    aboutRecipe: aboutRecipe?.trim() ?? null,
    seasonal: null, // later addition
    occasions: null, // later addition
    healthScore: null, // later addition
    ratingScore: null, // later addition
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

  const handleCloseUploadPicture = () => {
    setCanPressUploadPicture(false);
    setShowUploadPicture(false);
    setTimeout(() => {
      setCanPressUploadPicture(true);
    }, 2000);
  };

  const handleCloseAboutRecipe = () => {
    setCanPressAboutRecipe(false);
    setShowAboutRecipe(false);
    setTimeout(() => {
      setCanPressAboutRecipe(true);
    }, 2000);
  };

  const resetForm = () => {
    setRecipeName(null);
    setSourceMaterial(displayDropField(displaySourceType));
    setSource(null);
    setSourceURL(null);
    setCuisineType(displayDropArray(displayCuisineTypes));
    setDishType(displayDropArray(displayDishTypes));
    setDietType(displayDropArray(displayDietTypes));
    setServings(null);
    setPrepTime(null);
    setCookTime(null);
    setIngredients([]);
    setInstructions([]);
    setAboutRecipe(null);
    setFinalImage(null);
    setTempIngAmount(null);
    setTempIngMeasurement(displayDropField(displayMeasurements));
    setTempIngName(null);
    setTempNote(null);
    setTempName(null);
    setTempSteps([]);
    setTempAction(null);
    setShowInstructions(false);
    setShowIngredients(false);
    setShowUploadPicture(false);
    setShowAboutRecipe(false);
    setCanPressIngredients(true);
    setCanPressInstructions(true);
    setCanPressUploadPicture(true);
    setCanPressAboutRecipe(true);
    setRecipeName(null);
    setValidation1(false);
    setValidation2(false);
    setValidation3(false);
    setValidation4(false);
  };

  const handleSaveRecipe = () => {
    if (canSave) {
      kqconsole.log('Saving Recipe', recipeObject);
      console.log('Final Image:', finalImage);
      dispatch({
        type: 'ADD_ITEM_TO_RECIPE_BOX',
        payload: {
          recipeBoxID: core?.recipeBoxID,
          newRecipe: recipeObject,
          finalImage: finalImage,
          profileID: core?.userID,
        },
      });
      resetForm();
    }
  };

  // Dev testing code to import a recipe
  // const importRecipe = myRecipe[0];

  // useMemo(() => {
  //   if (importRecipe) {
  //     setRecipeName(importRecipe.title);
  //     setSourceMaterial(
  //       displaySourceType.find(
  //         item => item.key === importRecipe.sourceMaterial,
  //       ) || null,
  //     );
  //     setSource('personal');
  //     setSourceType('personal');
  //     setCuisineType(
  //       displayCuisineTypes.filter(c =>
  //         importRecipe.cuisines?.includes(c.value),
  //       ) || null,
  //     );
  //     setDishType(
  //       displayDishTypes.filter(d =>
  //         importRecipe.dishTypes?.includes(d.value),
  //       ) || null,
  //     );
  //     setDietType(
  //       displayDietTypes.filter(d => importRecipe.diets?.includes(d.value)) ||
  //         null,
  //     );
  //     setServings(importRecipe.servings?.toString() || null);
  //     setPrepTime(importRecipe.prepTime?.toString() || null);
  //     setCookTime(importRecipe.cookTime?.toString() || null);
  //     setIngredients(importRecipe.ingredients || []);
  //     setInstructions(importRecipe.instructions || []);
  //     setAboutRecipe(importRecipe.aboutRecipe || null);
  //   }
  // }, [importRecipe]);

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
      mode={
        showIngredients ||
        showInstructions ||
        showAboutRecipe ||
        showUploadPicture
          ? 'static'
          : 'keyboard-scroll'
      }
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
        <View flex mt20>
          <Button
            textSize="small"
            size="medium"
            disabled={!canPressAboutRecipe}
            onPress={() => {
              setShowAboutRecipe(true);
            }}>
            Add Description
          </Button>
        </View>
        <View flex mt20>
          <Button
            textSize="small"
            size="medium"
            disabled={
              !canPressUploadPicture || recipeName === null || recipeName === ''
            }
            onPress={() => {
              setShowUploadPicture(true);
            }}>
            Upload Picture
          </Button>
        </View>
      </View>
      <View row>
        <View flex mt5>
          <Button
            textSize="small"
            size="medium"
            disabled={!canPressIngredients}
            onPress={() => {
              setShowIngredients(true);
            }}>
            Add Ingredients
            {ingredients?.length > 0 && ` (${ingredients?.length})`}
          </Button>
        </View>
        <View flex mt5>
          <Button
            textSize="small"
            size="medium"
            disabled={!canPressInstructions}
            onPress={() => {
              setShowInstructions(true);
            }}>
            Add Instructions
            {instructions?.length > 0 && ` (${instructions?.length})`}
          </Button>
        </View>
      </View>

      <View style={{height: 100}} />

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

      <BottomSheet
        visible={showAboutRecipe}
        onClose={handleCloseAboutRecipe}
        snapPoints={[0.01, 0.95]}>
        <Input
          label="Recipe Description"
          caption="Optional: Info about this recipe"
          placeholder="Ex: This is a warm and hearty dish that..."
          value={aboutRecipe}
          onChangeText={setAboutRecipe}
          capitalize
          capitalMode="sentences"
          multiline
          multiHeight="large"
          counter
          maxCount={300}
          textInputStyles={{height: 140}}
        />

        <View row>
          <View flex />
          <View>
            <Button onPress={handleCloseAboutRecipe}>Finished</Button>
          </View>
        </View>
        <View mt25 ph15>
          <Text centered size="xSmall" italic kqColor="dark70">
            Note: Description will not be shown in Recipe Box Recipe View. It
            will appear when/if recipe is shared publicly.
          </Text>
        </View>
      </BottomSheet>
      <BottomSheet
        visible={showUploadPicture}
        onClose={handleCloseUploadPicture}
        snapPoints={[0.01, 0.95]}>
        <UploadPicture
          pictureName={pictureName}
          handleCloseUploadPicture={handleCloseUploadPicture}
          finalImage={finalImage}
          setFinalImage={setFinalImage}
        />
      </BottomSheet>
    </Layout>
  );
};

export default AddRecipe;
