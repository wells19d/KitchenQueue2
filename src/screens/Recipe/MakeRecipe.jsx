// MakeRecipe.jsx

import {useCupboard} from '../../hooks/useHooks';
import {Button, View} from '../../KQ-UI';
import useRecipeFunction from './Helpers/useRecipeFunction';

const MakeRecipe = ({recipeIngredients, selectedRecipe, onClose}) => {
  const {handleMakeRecipe} = useRecipeFunction({selectedRecipe, onClose});
  const cupboard = useCupboard();

  const cupboardItems = Array.isArray(cupboard?.items) ? cupboard?.items : [];
  console.log('Cupboards:', cupboardItems);

  console.log('Recipe Ingredients:', recipeIngredients);

  return (
    <View flex pt={5}>
      <Button
        textSize="xSmall"
        onPress={handleMakeRecipe}
        style={{
          borderRadius: 10,
          height: 35,
        }}>
        Make This Recipe
      </Button>
    </View>
  );
};

export default MakeRecipe;
