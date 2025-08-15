// recipe.saga.jsx
import {put, takeLatest, call, select} from 'redux-saga/effects';
import uuid from 'react-native-uuid';
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
import {checkLimit} from '../../utilities/checkLimit';
import {capFirst} from '../../utilities/helpers';

const db = getFirestore(getApp());

function* fetchCommunityRecipes(action) {
  const {keywords, allowance, profileID, accountID} = action.payload;

  try {
    const trimmed = keywords?.trim();

    if (!trimmed || trimmed.length < 2) {
      yield put({type: 'SET_COMMUNITY_RECIPES', payload: []});
      return;
    }

    const keys = yield call(fetchRemoteKeys);
    const appID = keys?.algolia?.appID;
    const searchKey = keys?.algolia?.searchKey;

    if (!appID || !searchKey) {
      throw new Error('Algolia configuration missing from Remote Config!');
    }

    const client = algoliasearch(appID, searchKey);
    const index = client.initIndex('community_recipes');

    const {hits} = yield call([index, index.search], trimmed, {
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
        const data = recipeDocSnapshot.data();
        fetchedRecipes.push({
          id: recipeDocSnapshot.id,
          ...data,
          imageUri: `https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2F${encodeURIComponent(
            data.image,
          )}?alt=media`,
        });
      } else {
        console.warn(`[Saga] Firestore doc missing for ID: ${id}`);
      }
    }
    yield put({
      type: 'COUNT_UP_DAILY',
      payload: {
        updatedData: {
          dailyRecipeCounter: allowance + 1,
        },
        profileID,
        accountID,
      },
    });
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

function* fetchPersonalRecipes(action) {
  const {recipeBoxID} = action.payload;
  try {
    const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
    const recipeBoxDoc = yield call(getDoc, recipeBoxRef);

    if (recipeBoxDoc.exists) {
      let recipeBoxData = recipeBoxDoc.data();

      if (!recipeBoxData.items) {
        recipeBoxData = {...recipeBoxData, items: []};

        yield call(() =>
          updateDoc(recipeBoxRef, {
            items: [],
            lastUpdated: new Date().toISOString(),
          }),
        );
      }

      let recipe = {
        ...recipeBoxData,
        lastUpdated: recipeBoxData?.toDate?.().toISOString() ?? null,
      };

      yield put({type: 'SET_RECIPE_BOX', payload: recipe});
    } else {
      yield put({type: 'SET_RECIPE_BOX', payload: null});
    }
  } catch (error) {
    yield put({type: 'RECIPE_BOX_SET_FAILED', payload: error.message});
  }
}

function* addToPersonalRecipes(action) {
  const {recipeBoxID, newRecipe, finalImage, profileID} = action.payload;
  console.log('action', action.payload);

  try {
    const account = yield select(state => state.account.account);
    const recipeBox = yield select(state => state.recipe.recipeBox);

    const maxRecipeBoxItems = account?.recipeBoxLimit || 0;
    const recipeBoxLength = recipeBox?.items?.length || 0;

    const isAllowed = checkLimit({
      current: recipeBoxLength,
      max: maxRecipeBoxItems,
      label: 'Recipe Box',
    });

    if (!isAllowed) return;

    const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
    const recipeBoxDoc = yield call(getDoc, recipeBoxRef);

    if (recipeBoxDoc.exists) {
      const recipeBoxData = recipeBoxDoc.data();

      const updatedItems = [
        ...(recipeBoxData.items || []),
        {
          ...newRecipe,
          itemId: uuid.v4(),
          createdBy: profileID,
          itemDate: new Date().toISOString(),
        },
      ];

      yield call(() =>
        updateDoc(recipeBoxRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );
      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: `${capFirst(newRecipe?.title)} added to the recipe box.`,
      });
    } else {
      yield put({
        type: 'RECIPE_BOX_ADD_FAILED',
        payload: 'Recipe box not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Add Recipe',
        text2: 'Recipe box not found. Please try again later.',
      });
    }
  } catch (error) {
    console.error(error);
    yield put({type: 'RECIPE_BOX_ADD_FAILED', payload: error.message});
    Toast.show({
      type: 'danger',
      text1: 'Failed to Add Recipe',
      text2: `${capFirst(
        newRecipe?.title,
      )} could not be added. Please try again later.`,
    });
  }
}

function* updateToPersonalRecipes(action) {}
function* deleteFromPersonalRecipes(action) {}
function* resetRecipeBox(action) {}

export default function* recipeSaga() {
  yield takeLatest('FETCH_COMMUNITY_RECIPES', fetchCommunityRecipes);
  yield takeLatest('ADD_TO_COMMUNITY_RECIPES', addToCommunityRecipes);
  yield takeLatest('UPDATE_TO_COMMUNITY_RECIPES', updateToCommunityRecipes);
  yield takeLatest('DELETE_FROM_COMMUNITY_RECIPES', deleteFromCommunityRecipes);
  yield takeLatest('FETCH_RECIPE_BOX', fetchPersonalRecipes);
  yield takeLatest('ADD_ITEM_TO_RECIPE_BOX', addToPersonalRecipes);
  yield takeLatest('UPDATE_ITEM_IN_RECIPE_BOX', updateToPersonalRecipes);
  yield takeLatest('DELETE_ITEM_FROM_RECIPE_BOX', deleteFromPersonalRecipes);
  yield takeLatest('RESET_FAVORITES', resetRecipeBox);
}
