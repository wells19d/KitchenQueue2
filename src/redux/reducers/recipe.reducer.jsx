// recipe.reducer.jsx
const initialState = {
  communityRecipes: [],
  loading: false,
  error: null,
};

export default function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_COMMUNITY_RECIPES':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'SET_COMMUNITY_RECIPES':
      return {
        ...state,
        communityRecipes: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_COMMUNITY_RECIPES_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'RESET_COMMUNITY_RECIPES':
      return {
        ...state,
        communityRecipes: [],
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}
