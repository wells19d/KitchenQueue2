// recipe.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
import Toast from 'react-native-toast-message';
import {
  getFirestore,
  getDoc,
  updateDoc,
  doc,
  writeBatch,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import algoliasearch from 'algoliasearch';
import {fetchRemoteKeys} from '../../../firebase.config';

const db = getFirestore(getApp());

function* fetchCommunityRecipes(action) {
  const {keywords} = action.payload;

  try {
    // --- Step 1: Algolia Search ---
    const keys = yield call(fetchRemoteKeys);
    const appID = keys?.algolia?.appID;
    const searchKey = keys?.algolia?.searchKey;

    if (!appID || !searchKey) {
      throw new Error('Algolia configuration missing from Remote Config!');
    }

    const client = algoliasearch(appID, searchKey);
    const index = client.initIndex('community_recipes');

    const {hits} = yield call([index, index.search], keywords, {
      hitsPerPage: 20,
      attributesToRetrieve: ['id'],
    });

    const recipeIds = hits.map(hit => hit.id);

    if (recipeIds.length === 0) {
      yield put({type: 'SET_COMMUNITY_RECIPES', payload: []});
      return;
    }

    const fetchedRecipes = [];

    for (const id of recipeIds) {
      const recipeDocRef = doc(db, 'community', id);
      const recipeDocSnapshot = yield call(getDoc, recipeDocRef);

      if (recipeDocSnapshot.exists) {
        fetchedRecipes.push({
          id: recipeDocSnapshot.id,
          ...recipeDocSnapshot.data(),
        });
      }
    }

    yield put({type: 'SET_COMMUNITY_RECIPES', payload: fetchedRecipes});
  } catch (error) {
    console.error('Algolia/Firestore search error:', error);
    Toast.show({
      type: 'error',
      text1: 'Search Error',
      text2: error.message || 'An unexpected error occurred during search.',
    });
    yield put({type: 'SET_COMMUNITY_RECIPES_ERROR', payload: error.message});
  }
}

function* addToCommunityRecipes(action) {}
function* updateToCommunityRecipes(action) {}
function* deleteFromCommunityRecipes(action) {}
function* fetchPersonalRecipes(action) {}
function* addToPersonalRecipes(action) {}
function* updateToPersonalRecipes(action) {}
function* deleteFromPersonalRecipes(action) {}

export default function* recipeSaga() {
  yield takeLatest('FETCH_COMMUNITY_RECIPES', fetchCommunityRecipes);
  yield takeLatest('ADD_TO_COMMUNITY_RECIPES', addToCommunityRecipes);
  yield takeLatest('UPDATE_TO_COMMUNITY_RECIPES', updateToCommunityRecipes);
  yield takeLatest('DELETE_FROM_COMMUNITY_RECIPES', deleteFromCommunityRecipes);
  yield takeLatest('FETCH_PERSONAL_RECIPES', fetchPersonalRecipes);
  yield takeLatest('ADD_TO_PERSONAL_RECIPES', addToPersonalRecipes);
  yield takeLatest('UPDATE_TO_PERSONAL_RECIPES', updateToPersonalRecipes);
  yield takeLatest('DELETE_FROM_PERSONAL_RECIPES', deleteFromPersonalRecipes);
}
