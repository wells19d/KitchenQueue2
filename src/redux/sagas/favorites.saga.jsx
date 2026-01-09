//*favorite.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';
import {
  getFirestore,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import {select} from 'redux-saga/effects';
import {checkLimit} from '../../utilities/checkLimit';
import {itemOrderFormat} from '../../utilities/helpers';

const db = getFirestore(getApp());

function* fetchFavorites(action) {
  const {favoriteItemsID} = action.payload;
  try {
    const favoritesRef = doc(db, 'favoriteItems', favoriteItemsID);
    const favoritesDoc = yield call(getDoc, favoritesRef);

    if (favoritesDoc.exists) {
      let favoritesData = favoritesDoc.data();

      if (!favoritesData.items) {
        favoritesData = {...favoritesData, items: []};

        yield call(() =>
          updateDoc(favoritesRef, {
            items: [],
            lastUpdated: serverTimestamp(),
          }),
        );
      }

      let favorite = {
        ...favoritesData,
        createdOn: favoritesData?.createdOn?.toDate?.().toISOString() ?? null,
        lastUpdated:
          favoritesData?.lastUpdated?.toDate?.().toISOString() ?? null,
      };

      yield put({type: 'SET_FAVORITES', payload: favorite});
    } else {
      yield put({type: 'SET_FAVORITES', payload: null});
    }
  } catch (error) {
    yield put({type: 'FAVORITES_SET_FAILED', payload: error.message});
  }
}

function* addItemToFavorites(action) {
  const {favoriteItemsID, newItem, profileID} = action.payload;
  try {
    const account = yield select(state => state.account.account);
    const favorites = yield select(state => state.favorites.favorites);

    const maxFavoriteItems = account?.favoriteItemsLimit || 0;
    const favoritesLength = favorites?.items?.length || 0;

    const isAllowed = checkLimit({
      current: favoritesLength,
      max: maxFavoriteItems,
      label: 'Favorites',
    });

    if (!isAllowed) return;

    const favoritesRef = doc(db, 'favoriteItems', favoriteItemsID);
    const favoritesDoc = yield call(getDoc, favoritesRef);

    if (favoritesDoc.exists) {
      const favoritesData = favoritesDoc.data();

      const updatedItems = [
        ...(favoritesData.items || []),
        itemOrderFormat({
          ...newItem,
          itemId: uuid.v4(),
          createdBy: profileID,
          itemDate: new Date().toISOString(),
        }),
      ];

      yield call(() =>
        updateDoc(favoritesRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: `${newItem.itemName} added to the favorites.`,
      });
    } else {
      yield put({
        type: 'FAVORITES_ADD_ITEM_FAILED',
        payload: 'Favorites not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Add Item',
        text2: 'Favorites not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'FAVORITES_ADD_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Add Item',
      text2: `${newItem.itemName} could not be added. Please try again later.`,
    });
  }
}

function* updateItemInFavorites(action) {
  const {favoriteItemsID, updatedItem, updateType, profileID} = action.payload;
  try {
    const favoritesRef = doc(db, 'favoriteItems', favoriteItemsID);
    const favoritesDoc = yield call(getDoc, favoritesRef);

    if (favoritesDoc.exists) {
      const favoritesData = favoritesDoc.data();
      const updatedItems = favoritesData?.items?.map(item =>
        item.itemId === updatedItem.itemId ? updatedItem : item,
      );

      yield call(() =>
        updateDoc(favoritesRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      if (updateType === 'updateList') {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} was updated in the favorites.`,
        });
      } else if (updateType === 'updateCart') {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} was updated in the favorites.`,
        });
      } else if (updateType === 'toCart') {
        Toast.show({
          type: 'success',
          text1: 'Item Added',
          text2: `${updatedItem.itemName} moved to the favorites.`,
        });
      } else if (updateType === 'toList') {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} moved to the favorites.`,
        });
      } else if (updateType === 'toCupboard') {
        // No toast needed, as the cupboard logic handles it
      } else {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} updated to the favorites.`,
        });
      }
    } else {
      yield put({
        type: 'FAVORITES_UPDATE_ITEM_FAILED',
        payload: 'Favorites not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Update Item',
        text2: 'Favorites not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'FAVORITES_UPDATE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Update Item',
      text2: `${updatedItem.itemName} could not be updated. Please try again later.`,
    });
  }
}

function* deleteItemFromFavorites(action) {
  const {favoriteItemsID, itemId, itemName, profileID} = action.payload;
  try {
    const favoritesRef = doc(db, 'favoriteItems', favoriteItemsID);
    const favoritesDoc = yield call(getDoc, favoritesRef);

    if (favoritesDoc.exists) {
      const favoritesData = favoritesDoc.data();

      const updatedItems = favoritesData?.items?.filter(
        item => item.itemId !== itemId,
      );

      yield call(() =>
        updateDoc(favoritesRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Item Deleted',
        text2: `${itemName} removed from the favorites.`,
      });
    } else {
      yield put({
        type: 'FAVORITES_DELETE_ITEM_FAILED',
        payload: 'Favorites not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Delete Item',
        text2: 'Favorites not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'FAVORITES_DELETE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Delete Item',
      text2: `${itemName} could not be removed. Please try again later.`,
    });
  }
}

function* resetFavorites(action) {
  const {favoriteItemsID, profileID} = action.payload;
  try {
    const favoritesRef = doc(db, 'favoriteItems', favoriteItemsID);
    const favoritesDoc = yield call(getDoc, favoritesRef);

    if (favoritesDoc.exists) {
      yield call(() =>
        updateDoc(favoritesRef, {
          items: [],
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_FAVORITES', payload: {favoriteItemsID}});

      Toast.show({
        type: 'success',
        text1: 'Favorites List Reset',
        text2: 'Your favorites has been cleared.',
      });
    } else {
      Toast.show({
        type: 'warning',
        text1: 'No Favorites Found',
        text2: 'Could not find a favorite to reset.',
      });
    }
  } catch (error) {
    yield put({type: 'FAVORITES_RESET_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Reset Failed',
      text2: 'Your favorites could not be reset. Please try again later.',
    });
  }
}

export default function* favoriteSaga() {
  yield takeLatest('FETCH_FAVORITES', fetchFavorites);
  yield takeLatest('ADD_ITEM_TO_FAVORITES', addItemToFavorites);
  yield takeLatest('UPDATE_ITEM_IN_FAVORITES', updateItemInFavorites);
  yield takeLatest('DELETE_ITEM_FROM_FAVORITES', deleteItemFromFavorites);
  yield takeLatest('RESET_FAVORITES', resetFavorites);
}
