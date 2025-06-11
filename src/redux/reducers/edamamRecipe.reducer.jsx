// edamamRecipe.reducer.jsx
const initialState = {
  recipeData: null,
  error: null,
  loading: false,
  nextHref: null,
};

export default function edamamRecipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_RECIPE_DATA':
      return {...state, loading: true, error: null};
    case 'SET_RECIPE_DATA':
      return {
        ...state,
        loading: false,
        recipeData: action.payload,
        nextHref: action.payload._links?.next?.href || null,
      };
    case 'RECIPE_API_FETCH_FAILED':
      return {...state, loading: false, error: action.payload};
    case 'RESET_RECIPE_DATA':
      return initialState;
    default:
      return state;
  }
}
