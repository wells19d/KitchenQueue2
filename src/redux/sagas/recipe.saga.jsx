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
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import algoliasearch from 'algoliasearch';
import {fetchRemoteKeys} from '../../../firebase.config';
import {checkLimit} from '../../utilities/checkLimit';
import {capFirst} from '../../utilities/helpers';
import storage from '@react-native-firebase/storage';

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
        // console.warn(`[Saga] Firestore doc missing for ID: ${id}`);
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
    // console.error('Algolia/Firestore search error:', error);
    Toast.show({
      type: 'error',
      text1: 'Search Error',
      text2: error.message || 'An unexpected error occurred during search.',
    });
    yield put({type: 'SET_COMMUNITY_RECIPES_ERROR', payload: error.message});
  }
}

function* bookmarkCommunityRecipes(action) {
  const {recipeBoxID, selectedRecipe, profileID} = action.payload;
  // console.log('action', action.payload);
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
          ...selectedRecipe,
          id: selectedRecipe.id,
          createdBy: profileID,
          itemDate: new Date().toISOString(),
        },
      ];

      // 🔑 Step 1: Upload image (if any)

      // 🔑 Step 2: Save recipe
      yield call(() =>
        updateDoc(recipeBoxRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Recipe Added',
        text2: `${capFirst(selectedRecipe?.title)} added to the recipe box.`,
      });
    } else {
      yield put({
        type: 'BOOKMARK_ADD_FAILED',
        payload: 'Recipe box not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Add Recipe',
        text2: 'Recipe box not found. Please try again later.',
      });
    }
  } catch (error) {
    // console.error(error);
    yield put({type: 'BOOKMARK_ADD_FAILED', payload: error.message});
    Toast.show({
      type: 'danger',
      text1: 'Failed to Add Recipe',
      text2: `${capFirst(
        selectedRecipe?.title,
      )} could not be added.Please try again later.`,
    });
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
            lastUpdated: serverTimestamp(),
          }),
        );
      }

      let recipe = {
        ...recipeBoxData,
        createdOn: recipeBoxData?.createdOn?.toDate?.().toISOString() ?? null,
        lastUpdated:
          recipeBoxData?.lastUpdated?.toDate?.().toISOString() ?? null,
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
  // console.log('action', action.payload);
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
          id: uuid.v4(),
          createdBy: profileID,
          itemDate: new Date().toISOString(),
        },
      ];

      // 🔑 Step 1: Upload image (if any)
      let imageSuccess = false;
      if (finalImage) {
        try {
          const reference = storage().ref(`recipes/${finalImage.name}`);
          yield call([reference, reference.putFile], finalImage.uri);
          yield call([reference, reference.getDownloadURL]); // optional, confirms upload
          imageSuccess = true;
          // console.log('✅ Image uploaded successfully');
        } catch (error) {
          // console.error('❌ Image upload failed:', error);
          imageSuccess = false;
        }
      }

      // 🔑 Step 2: Save recipe
      yield call(() =>
        updateDoc(recipeBoxRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      if (finalImage) {
        if (imageSuccess) {
          Toast.show({
            type: 'success',
            text1: 'Recipe Added',
            text2: `${capFirst(
              newRecipe?.title,
            )} and image was added to the recipe box.`,
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'Recipe Added',
            text2: `${capFirst(
              newRecipe?.title,
            )} added to the recipe box, but the image failed. You can try to add the image again using recipe update.`,
          });
        }
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recipe Added',
          text2: `${capFirst(newRecipe?.title)} added to the recipe box.`,
        });
      }
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
    // console.error(error);
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

function* updateToPersonalRecipes(action) {
  const {
    recipeBoxID,
    editedRecipe,
    finalImage,
    profileID,
    pictureWasChanged,
    oldImageName,
  } = action.payload;

  try {
    const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
    const recipeBoxDoc = yield call(getDoc, recipeBoxRef);

    if (recipeBoxDoc.exists) {
      const recipeBoxData = recipeBoxDoc.data();

      // 🔑 Step 1: Update the correct recipe in the array
      const updatedItems = (recipeBoxData.items || []).map(item =>
        item.id === editedRecipe.id
          ? {...item, ...editedRecipe, lastUpdated: new Date().toISOString()}
          : item,
      );

      let imageSuccess = false;
      let imageDeleted = false;

      // 🔑 Step 2: Remove the old image (if any)
      if (pictureWasChanged && oldImageName) {
        try {
          const oldImageRef = storage().ref(`recipes/${oldImageName}`);
          yield call([oldImageRef, oldImageRef.delete]);
          imageDeleted = true;
        } catch {
          imageDeleted = false; // ignore delete error
        }
      }

      // 🔑 Step 3: Upload the new image (if any)
      if (pictureWasChanged && finalImage) {
        try {
          const reference = storage().ref(`recipes/${finalImage.name}`);
          yield call([reference, reference.putFile], finalImage.uri);
          yield call([reference, reference.getDownloadURL]);
          imageSuccess = true;
        } catch {
          imageSuccess = false; // ignore upload error
        }
      }

      // 🔑 Step 4: Save the recipe
      yield call(updateDoc, recipeBoxRef, {
        items: updatedItems,
        lastUpdated: serverTimestamp(),
        lastUpdatedBy: profileID,
      });

      // 🔑 Step 5: Handle toast conditions
      if (imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capFirst(editedRecipe?.title)} and its image were updated.`,
        });
      } else if (!imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capFirst(editedRecipe?.title)} updated and image added.`,
        });
      } else if (pictureWasChanged && !imageSuccess) {
        Toast.show({
          type: 'warning',
          text1: 'Recipe Updated',
          text2: `${capFirst(
            editedRecipe?.title,
          )} updated, but the new image could not be saved.`,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capFirst(editedRecipe?.title)} updated successfully.`,
        });
      }
    } else {
      yield put({
        type: 'RECIPE_BOX_UPDATE_FAILED',
        payload: 'Recipe box not found.',
      });
    }
  } catch (error) {
    yield put({type: 'RECIPE_BOX_UPDATE_FAILED', payload: error.message});
    Toast.show({
      type: 'danger',
      text1: 'Failed to Update Recipe',
      text2: `${capFirst(
        editedRecipe?.title,
      )} could not be updated. Please try again later.`,
    });
  }
}

function* deleteFromPersonalRecipes(action) {
  const {recipeBoxID, selectedRecipe, profileID, owner} = action.payload;
  try {
    const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
    const recipeBoxDoc = yield call(getDoc, recipeBoxRef);

    const recipeID = selectedRecipe?.id;
    const itemName = selectedRecipe?.title || 'Recipe';
    const imageName = selectedRecipe?.image; // stored filename like "xxx.jpg"

    if (recipeBoxDoc.exists) {
      const recipeBoxData = recipeBoxDoc.data();

      const updatedItems = recipeBoxData?.items?.filter(
        item => item.id !== recipeID,
      );

      // 🔑 Step 1: Remove from recipeBox
      yield call(() =>
        updateDoc(recipeBoxRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      // 🔑 Step 2: Delete image only if owner
      if (owner && imageName) {
        try {
          const ref = storage().ref(`recipes/${imageName}`);
          yield call([ref, ref.getMetadata]); // ensure it exists
          yield call([ref, ref.delete]);
          // console.log(`🗑️ Deleted image from storage: ${imageName}`);
        } catch (err) {
          if (err.code === 'storage/object-not-found') {
            // console.warn(`⚠️ Image ${imageName} not found in storage`);
          } else {
            // console.error('❌ Failed to delete image:', err);
          }
        }
      }

      Toast.show({
        type: 'success',
        text1: owner ? 'Recipe Deleted' : 'Recipe Removed',
        text2: `${capFirst(itemName)} was ${
          owner ? 'deleted' : 'removed'
        } from the Recipe Box.`,
      });
    } else {
      yield put({
        type: 'RECIPE_BOX_DELETE_ITEM_FAILED',
        payload: 'Recipe not found.',
      });
      Toast.show({
        type: 'danger',
        text1: `Failed to ${owner ? 'Delete' : 'Remove'} Recipe`,
        text2: 'Recipe not found. Please try again later.',
      });
    }
  } catch (error) {
    // console.log(error);
    yield put({type: 'RECIPE_BOX_DELETE_ITEM_FAILED', payload: error.message});
    Toast.show({
      type: 'danger',
      text1: `Failed to ${owner ? 'Delete' : 'Remove'} Recipe`,
      text2: `${capFirst(selectedRecipe?.title) || 'Recipe'} could not be ${
        owner ? 'deleted' : 'removed'
      }. Please try again later.`,
    });
  }
}

function* resetRecipeBox(action) {}

export default function* recipeSaga() {
  yield takeLatest('FETCH_COMMUNITY_RECIPES', fetchCommunityRecipes);
  yield takeLatest('ADD_TO_COMMUNITY_RECIPES', addToCommunityRecipes);
  yield takeLatest('UPDATE_TO_COMMUNITY_RECIPES', updateToCommunityRecipes);
  yield takeLatest('DELETE_FROM_COMMUNITY_RECIPES', deleteFromCommunityRecipes);
  yield takeLatest('FETCH_RECIPE_BOX', fetchPersonalRecipes);
  yield takeLatest('ADD_ITEM_TO_RECIPE_BOX', addToPersonalRecipes);
  yield takeLatest('BOOKMARK_TO_RECIPE_BOX', bookmarkCommunityRecipes);
  yield takeLatest('UPDATE_ITEM_IN_RECIPE_BOX', updateToPersonalRecipes);
  yield takeLatest('DELETE_ITEM_FROM_RECIPE_BOX', deleteFromPersonalRecipes);
  yield takeLatest('RESET_FAVORITES', resetRecipeBox);
}
