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
  setDoc,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import algoliasearch from 'algoliasearch';
import {fetchRemoteKeys} from '../../../firebase.config';
import {checkLimit} from '../../utilities/checkLimit';
import {capEachWord, capFirst} from '../../utilities/helpers';
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
        if (data.isArchived) {
          continue; // skip archived recipes
        }
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

      yield put({
        type: 'SET_RECIPE_BOX',
        payload: {
          ...recipeBoxData,
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Recipe Added',
        text2: `${capEachWord(selectedRecipe?.title)} added to the recipe box.`,
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
      text2: `${capEachWord(
        selectedRecipe?.title,
      )} could not be added.Please try again later.`,
    });
  }
}

function* addToCommunityRecipes(action) {
  // this comes from someone sharing their recipe
  // let {recipe, admin, recipeBoxID} = action.payload;
  // try {
  //   if (!recipe?.id) return;
  //   let docRef = doc(db, 'community', recipe.id);
  //   // Check if this ID already exists (1 read)
  //   const existing = yield call(getDoc, docRef);
  //   if (existing.exists()) {
  //     const newId = uuid.v4();
  //     recipe = {...recipe, id: newId};
  //     docRef = doc(db, 'community', newId);
  //   }
  //   recipe = {
  //     ...recipe,
  //     recipeShared: true,
  //     userEdit: false,
  //     sharedStatus: admin ? 'approved' : 'pending-review',
  //   };
  //   // Write recipe to community
  //   yield call(setDoc, docRef, recipe);
  //   // Update in recipeBox
  //   const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
  //   const recipeBoxDoc = yield call(getDoc, recipeBoxRef);
  //   if (recipeBoxDoc.exists()) {
  //     const recipeBoxData = recipeBoxDoc.data();
  //     const updatedItems = (recipeBoxData.items || []).map(item =>
  //       item.id === (action.payload.recipe.id || recipe.id)
  //         ? {
  //             ...item,
  //             recipeShared: true,
  //             userEdit: false,
  //             sharedStatus: admin ? 'approved' : 'pending-review',
  //             ...(action.payload.recipe.id !== recipe.id && {id: recipe.id}),
  //           }
  //         : item,
  //     );
  //     yield call(updateDoc, recipeBoxRef, {
  //       items: updatedItems,
  //       lastUpdated: serverTimestamp(),
  //     });
  //     // ✅ update Redux immediately
  //     yield put({
  //       type: 'SET_RECIPE_BOX',
  //       payload: {
  //         ...recipeBoxData,
  //         items: updatedItems,
  //         lastUpdated: new Date().toISOString(),
  //       },
  //     });
  //   }
  //   Toast.show({
  //     type: 'success',
  //     text1: admin ? 'Recipe Added' : 'Recipe Submitted',
  //     text2: admin
  //       ? `${capEachWord(recipe?.title)} was added to the community recipes.`
  //       : `${capEachWord(
  //           recipe?.title,
  //         )} was submitted for review. You will be notified once it's approved.`,
  //   });
  // } catch (error) {
  //   yield put({type: 'COMMUNITY_ADD_FAILED', payload: error.message});
  //   Toast.show({
  //     type: 'danger',
  //     text1: 'Failed to Add Recipe',
  //     text2: `${capEachWord(
  //       recipe?.title,
  //     )} could not be added. Please try again later.`,
  //   });
  // }
}

function* shareToCommunityRecipes(action) {
  const {recipeBoxID, selectedRecipe, recipeID} = action.payload;

  try {
    const communityRef = doc(db, 'community', recipeID);
    const communityDoc = yield call(getDoc, communityRef);
    const idExists = communityDoc.exists();

    let finalID = recipeID;
    let finalDoc = {...selectedRecipe};

    if (idExists) {
      let newID;
      let newExists = true;
      let attempts = 0;
      const maxAttempts = 3;

      while (newExists && attempts < maxAttempts) {
        newID = uuid.v4();
        const checkRef = doc(db, 'community', newID);
        const checkDoc = yield call(getDoc, checkRef);
        newExists = checkDoc.exists();
        attempts++;
      }

      if (newExists) {
        Toast.show({
          type: 'danger',
          text1: 'Recipe Share Failed',
          text2:
            'An unexpected error occurred while sharing your recipe. Please try again later.',
        });
        return;
      }

      finalID = newID;
      finalDoc = {...selectedRecipe, id: newID};
    }

    // 🧹 Remove transient fields before saving
    const {imageUri, lastUpdated, itemDate, ...cleanDoc} = finalDoc;

    const targetRef = doc(db, 'community', finalID);
    yield call(setDoc, targetRef, cleanDoc);

    // Step 4: Mirror update in user's recipe box
    const recipeBoxRef = doc(db, 'recipeBoxes', recipeBoxID);
    const recipeBoxDoc = yield call(getDoc, recipeBoxRef);

    if (recipeBoxDoc.exists) {
      const recipeBoxData = recipeBoxDoc.data();

      // remove old recipe and insert the shared version
      const filteredItems = (recipeBoxData.items || []).filter(
        item => item.id !== recipeID,
      );

      const updatedItems = [...filteredItems, cleanDoc];

      yield call(updateDoc, recipeBoxRef, {items: updatedItems});

      yield put({
        type: 'SET_RECIPE_BOX',
        payload: {
          ...recipeBoxData,
          items: updatedItems,
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Recipe Shared',
        text2: `${capEachWord(cleanDoc?.title)} is now part of the community.`,
      });
    } else {
      Toast.show({
        type: 'danger',
        text1: 'Recipe Share Failed',
        text2: 'Could not update your recipe box. Please try again later.',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'danger',
      text1: 'Recipe Share Failed',
      text2:
        'An unexpected error occurred while sharing your recipe. Please try again later.',
    });
  }
}

function* updateToCommunityRecipes(action) {
  const {editedRecipe, finalImage, profileID, pictureWasChanged, oldImageName} =
    action.payload;

  try {
    const communityRef = doc(db, 'community', editedRecipe?.id);
    const communityDoc = yield call(getDoc, communityRef);

    if (communityDoc.exists()) {
      let imageSuccess = false;
      let imageDeleted = false;

      // 🔑 Step 1: Remove the old image (if changed)
      if (pictureWasChanged && oldImageName) {
        try {
          const oldRef = storage().ref(`recipes/${oldImageName}`);
          yield call([oldRef, oldRef.delete]);
          imageDeleted = true;
        } catch {
          imageDeleted = false; // ignore delete error
        }
      }

      // 🔑 Step 2: Upload new image (if changed)
      if (pictureWasChanged && finalImage) {
        try {
          const newRef = storage().ref(`recipes/${finalImage.name}`);
          yield call([newRef, newRef.putFile], finalImage.uri);
          // Don’t use getDownloadURL() – we always build static URIs
          imageSuccess = true;

          // Apply new image data (filename + date)
          editedRecipe.image = finalImage.name;
          editedRecipe.imageDate = finalImage.imageDate;

          // Clean static public URI (no ?token)
          editedRecipe.imageUri = `https://firebasestorage.googleapis.com/v0/b/kitchen-queue-fe2fe.firebasestorage.app/o/recipes%2F${encodeURIComponent(
            finalImage.name,
          )}?alt=media`;
        } catch {
          imageSuccess = false;
        }
      }

      // 🔑 Step 3: Clean transient fields before writing
      const {imageUri, ...cleanRecipe} = editedRecipe;

      // 🔑 Step 4: Update the document
      yield call(updateDoc, communityRef, {
        ...cleanRecipe,
        image: editedRecipe.image,
        imageDate: editedRecipe.imageDate,
        lastUpdated: serverTimestamp(),
        lastUpdatedBy: profileID,
      });

      // 🔑 Step 5: Refresh local state
      const updatedDoc = yield call(getDoc, communityRef);
      const updatedRecipe = {id: updatedDoc.id, ...updatedDoc.data()};

      const currentRecipes = yield select(
        state => state.recipe.communityRecipes,
      );

      const updatedList = currentRecipes.map(rec =>
        rec.id === updatedRecipe.id ? updatedRecipe : rec,
      );

      yield put({
        type: 'SET_COMMUNITY_RECIPES',
        payload: updatedList,
      });

      // 🔑 Step 6: Toasts
      if (imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(
            editedRecipe?.title,
          )} and its image were updated.`,
        });
      } else if (!imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(editedRecipe?.title)} updated and image added.`,
        });
      } else if (pictureWasChanged && !imageSuccess) {
        Toast.show({
          type: 'warning',
          text1: 'Recipe Updated',
          text2: `${capEachWord(
            editedRecipe?.title,
          )} updated, but the new image could not be saved.`,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(editedRecipe?.title)} updated successfully.`,
        });
      }
    } else {
      yield put({
        type: 'UPDATE_TO_COMMUNITY_RECIPES_FAILED',
        payload: 'Recipe not found.',
      });
    }
  } catch (error) {
    yield put({
      type: 'UPDATE_TO_COMMUNITY_RECIPES_FAILED',
      payload: error.message,
    });
    Toast.show({
      type: 'danger',
      text1: 'Failed to Update Recipe',
      text2: `${capEachWord(
        editedRecipe?.title,
      )} could not be updated. Please try again later.`,
    });
  }
}

function* deleteFromCommunityRecipes(action) {
  // when admin deletes the community recipe
}

function* updateToCommunityRecipesRequest(action) {
  // when someone sends in a request to edit their recipe
}

function* deleteFromCommunityRecipesRequest(action) {
  // when someone sends in a request to delete their recipe
}

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

      yield put({
        type: 'SET_RECIPE_BOX',
        payload: {
          ...recipeBoxData,
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        },
      });

      if (finalImage) {
        if (imageSuccess) {
          Toast.show({
            type: 'success',
            text1: 'Recipe Added',
            text2: `${capEachWord(
              newRecipe?.title,
            )} and image was added to the recipe box.`,
          });
        } else {
          Toast.show({
            type: 'success',
            text1: 'Recipe Added',
            text2: `${capEachWord(
              newRecipe?.title,
            )} added to the recipe box, but the image failed. You can try to add the image again using recipe update.`,
          });
        }
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recipe Added',
          text2: `${capEachWord(
            newRecipe?.title,
          )} was added to the recipe box.`,
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
      text2: `${capEachWord(
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

      yield put({
        type: 'SET_RECIPE_BOX',
        payload: {
          ...recipeBoxData,
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        },
      });

      // 🔑 Step 5: Handle toast conditions
      if (imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(
            editedRecipe?.title,
          )} and its image were updated.`,
        });
      } else if (!imageDeleted && imageSuccess && pictureWasChanged) {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(editedRecipe?.title)} updated and image added.`,
        });
      } else if (pictureWasChanged && !imageSuccess) {
        Toast.show({
          type: 'warning',
          text1: 'Recipe Updated',
          text2: `${capEachWord(
            editedRecipe?.title,
          )} updated, but the new image could not be saved.`,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Recipe Updated',
          text2: `${capEachWord(editedRecipe?.title)} updated successfully.`,
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
      text2: `${capEachWord(
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

      yield put({
        type: 'SET_RECIPE_BOX',
        payload: {
          ...recipeBoxData,
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        },
      });

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
        text2: `${capEachWord(itemName)} was ${
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
      text2: `${capEachWord(selectedRecipe?.title) || 'Recipe'} could not be ${
        owner ? 'deleted' : 'removed'
      }. Please try again later.`,
    });
  }
}

function* resetRecipeBox(action) {}

export default function* recipeSaga() {
  yield takeLatest('FETCH_COMMUNITY_RECIPES', fetchCommunityRecipes);
  yield takeLatest('ADD_TO_COMMUNITY_RECIPES', addToCommunityRecipes);
  yield takeLatest('SHARE_TO_COMMUNITY_RECIPES', shareToCommunityRecipes);
  yield takeLatest('UPDATE_TO_COMMUNITY_RECIPES', updateToCommunityRecipes);
  yield takeLatest('DELETE_FROM_COMMUNITY_RECIPES', deleteFromCommunityRecipes);
  yield takeLatest('FETCH_RECIPE_BOX', fetchPersonalRecipes);
  yield takeLatest('ADD_ITEM_TO_RECIPE_BOX', addToPersonalRecipes);
  yield takeLatest('BOOKMARK_TO_RECIPE_BOX', bookmarkCommunityRecipes);
  yield takeLatest('UPDATE_ITEM_IN_RECIPE_BOX', updateToPersonalRecipes);
  yield takeLatest('DELETE_ITEM_FROM_RECIPE_BOX', deleteFromPersonalRecipes);
  yield takeLatest('RESET_FAVORITES', resetRecipeBox);
  yield takeLatest(
    'UPDATE_TO_COMMUNITY_RECIPES_REQUEST',
    updateToCommunityRecipesRequest,
  );
  yield takeLatest(
    'DELETE_FROM_COMMUNITY_RECIPES_REQUEST',
    deleteFromCommunityRecipesRequest,
  );
}
