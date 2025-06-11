// edamamRecipe.saga.jsx
import {takeLatest, call, put} from 'redux-saga/effects';
import {fetchEdamamKeys} from '../../../firebase.config';

function* fetchRecipeData(action) {
  const {query, filters = {}} = action.payload;
  const {recipe} = yield call(fetchEdamamKeys);
  const {appId, appKey} = recipe;

  const baseUrl = 'https://api.edamam.com/api/recipes/v2';
  const url = new URL(baseUrl);
  url.searchParams.append('type', 'public');
  url.searchParams.append('q', query);
  url.searchParams.append('app_id', appId);
  url.searchParams.append('app_key', appKey);

  // Add optional filters
  if (filters.mealType) url.searchParams.append('mealType', filters.mealType);
  if (filters.cuisineType)
    url.searchParams.append('cuisineType', filters.cuisineType);
  // Add other filters similarly...

  try {
    const response = yield call(fetch, url.toString());
    if (!response.ok) throw new Error(`API status ${response.status}`);
    const data = yield response.json();

    yield put({type: 'SET_RECIPE_DATA', payload: data});
  } catch (error) {
    yield put({type: 'RECIPE_API_FETCH_FAILED', payload: error.message});
  }
}

export default function* edamamRecipeSaga() {
  yield takeLatest('FETCH_RECIPE_DATA', fetchRecipeData);
}
