//*cupboard.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
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
import {select} from 'redux-saga/effects';
import {checkLimit} from '../../utilities/checkLimit';

const db = getFirestore(getApp());

function* fetchCupboard(action) {
  const {cupboardID} = action.payload;
  try {
    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      let cupboardData = cupboardDoc.data();

      if (!cupboardData.items) {
        cupboardData = {...cupboardData, items: []};

        yield call(() =>
          updateDoc(cupboardRef, {
            items: [],
            lastUpdated: serverTimestamp(),
          }),
        );
      }

      let cupboard = {
        ...cupboardData,
        createdOn: cupboardData?.createdOn?.toDate?.().toISOString() ?? null,
        lastUpdated: cupboardData?.lastUpdated.toDate?.().toISOString() ?? null,
      };

      yield put({type: 'SET_CUPBOARD', payload: cupboard});
    } else {
      yield put({type: 'SET_CUPBOARD', payload: null});
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_SET_FAILED', payload: error.message});
  }
}

function* addItemToCupboard(action) {
  const {cupboardID, newItem, profileID} = action.payload;
  try {
    const account = yield select(state => state.account.account);
    const cupboard = yield select(state => state.cupboard.cupboard);

    const maxCupboardItems = account?.cupboardLimit || 0;
    const cupboardLength = cupboard?.items?.length || 0;

    const isAllowed = checkLimit({
      current: cupboardLength,
      max: maxCupboardItems,
      label: 'Cupboard',
    });

    if (!isAllowed) return;

    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      const cupboardData = cupboardDoc.data();

      const updatedItems = [
        ...(cupboardData.items || []),
        {
          ...newItem,
          itemId: uuid.v4(),
          createdBy: profileID,
          itemDate: new Date().toISOString(),
        },
      ];

      yield call(() =>
        updateDoc(cupboardRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: `${newItem.itemName} added to the cupboard.`,
      });
    } else {
      yield put({
        type: 'CUPBOARD_ADD_ITEM_FAILED',
        payload: 'Cupboard not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Add Item',
        text2: 'Cupboard not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_ADD_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Add Item',
      text2: `${newItem.itemName} could not be added. Please try again later.`,
    });
  }
}

function* updateItemInCupboard(action) {
  const {cupboardID, updatedItem, profileID} = action.payload;
  try {
    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      const cupboardData = cupboardDoc.data();
      const updatedItems = cupboardData?.items?.map(item =>
        item.itemId === updatedItem.itemId ? updatedItem : item,
      );

      yield call(() =>
        updateDoc(cupboardRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Item Updated',
        text2: `${updatedItem.itemName} updated in the cupboard.`,
      });
    } else {
      yield put({
        type: 'CUPBOARD_UPDATE_ITEM_FAILED',
        payload: 'Cupboard not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Update Item',
        text2: 'Cupboard not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_UPDATE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Update Item',
      text2: `${updatedItem.itemName} could not be updated. Please try again later.`,
    });
  }
}

function* deleteItemFromCupboard(action) {
  const {cupboardID, itemId, itemName, profileID} = action.payload;
  try {
    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      const cupboardData = cupboardDoc.data();

      const updatedItems = cupboardData?.items?.filter(
        item => item.itemId !== itemId,
      );

      yield call(() =>
        updateDoc(cupboardRef, {
          items: updatedItems,
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Item Deleted',
        text2: `${itemName} removed from the cupboard.`,
      });
    } else {
      yield put({
        type: 'CUPBOARD_DELETE_ITEM_FAILED',
        payload: 'Cupboard not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Delete Item',
        text2: 'Cupboard not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_DELETE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Delete Item',
      text2: `${itemName} could not be removed. Please try again later.`,
    });
  }
}

function* batchToCupboard(action) {
  // This function is used to add multiple items to the cupboard at once from checkout
  const {cupboardID, items, profileID} = action.payload;

  try {
    const account = yield select(state => state.account.account);
    const cupboard = yield select(state => state.cupboard.cupboard);

    const maxCupboardItems = account?.cupboardLimit || 0;
    const cupboardLength = cupboard?.items?.length || 0;

    const incomingItemCount = items.reduce((total, item) => {
      return total + (item.quantity > 0 ? item.quantity : 1);
    }, 0);

    const isAllowed = checkLimit({
      current: cupboardLength,
      incoming: incomingItemCount,
      max: maxCupboardItems,
      label: 'Cupboard',
    });

    if (!isAllowed) return;

    yield put({type: 'CUPBOARD_BATCH_ADD_START'});

    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      const cupboardData = cupboardDoc.data();
      const batch = writeBatch(db);
      let updatedItems = [...(cupboardData.items || [])];

      items.forEach(item => {
        const {
          itemName,
          brandName,
          description,
          packageSize,
          measurement,
          category,
          notes,
        } = item;

        for (let i = 0; i < item.quantity; i++) {
          const newItem = {
            itemName: itemName || '',
            brandName: brandName || '',
            description: description || '',
            packageSize: Number(packageSize) || 1,
            remainingAmount: Number(packageSize) || 1,
            measurement: measurement || '',
            category: category || '',
            notes: notes || '',
            itemId: uuid.v4(),
            itemDate: new Date().toISOString(),
            createdBy: profileID,
          };

          updatedItems.push(newItem);
        }
      });

      batch.update(cupboardRef, {
        items: updatedItems,
        lastUpdated: serverTimestamp(),
        lastUpdatedBy: profileID,
      });

      yield call(() => batch.commit());

      Toast.show({
        type: 'success',
        text1: 'Items Added',
        text2: `Items were added to the cupboard.`,
      });

      yield put({type: 'CUPBOARD_BATCH_ADD_SUCCESS'});

      yield put({
        type: 'DELETE_LIST_FROM_SHOP_CART',
        payload: {
          shoppingCartID: account.shoppingCartID,
          items,
          profileID,
        },
      });
    } else {
      yield put({
        type: 'CUPBOARD_BATCH_ADD_FAILED',
        payload: 'Cupboard not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Batch Add Failed',
        text2: 'Cupboard not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_BATCH_ADD_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Batch Add Failed',
      text2:
        'Items could not be added to the cupboard. Please try again later.',
    });
  }
}

function* batchAddToCupboard(action) {
  // This is the same as batchToCupboard but for adding a single item multiple times using a quantity
  const {cupboardID, newItem, quantity, profileID} = action.payload;

  try {
    const account = yield select(state => state.account.account);
    const cupboard = yield select(state => state.cupboard.cupboard);

    const maxCupboardItems = account?.cupboardLimit || 0;
    const cupboardLength = cupboard?.items?.length || 0;

    const isAllowed = checkLimit({
      current: cupboardLength,
      incoming: quantity,
      max: maxCupboardItems,
      label: 'Cupboard',
    });

    if (!isAllowed) return;

    yield put({type: 'CUPBOARD_BATCH_ADD_START'});

    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      const cupboardData = cupboardDoc.data();
      const batch = writeBatch(db);
      let updatedItems = [...(cupboardData.items || [])];

      const {
        itemName,
        brandName,
        description,
        packageSize,
        measurement,
        category,
        notes,
      } = newItem;

      for (let i = 0; i < quantity; i++) {
        const item = {
          itemName: itemName || '',
          brandName: brandName || '',
          description: description || '',
          packageSize: Number(packageSize) || 1,
          remainingAmount: Number(packageSize) || 1,
          measurement: measurement || '',
          category: category || '',
          notes: notes || '',
          itemId: uuid.v4(),
          itemDate: new Date().toISOString(),
          createdBy: profileID,
        };

        updatedItems.push(item);
      }

      batch.update(cupboardRef, {
        items: updatedItems,
        lastUpdated: serverTimestamp(),
        lastUpdatedBy: profileID,
      });

      yield call(() => batch.commit());

      Toast.show({
        type: 'success',
        text1: 'Items Added',
        text2: `${quantity} ${itemName}'s were added to the cupboard.`,
      });

      yield put({type: 'CUPBOARD_BATCH_ADD_SUCCESS'});
    } else {
      yield put({
        type: 'CUPBOARD_BATCH_ADD_FAILED',
        payload: 'Cupboard not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Batch Add Failed',
        text2: 'Cupboard not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_BATCH_ADD_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Batch Add Failed',
      text2:
        'Items could not be added to the cupboard. Please try again later.',
    });
  }
}

function* resetCupboard(action) {
  const {cupboardID, profileID} = action.payload;
  try {
    const cupboardRef = doc(db, 'cupboards', cupboardID);
    const cupboardDoc = yield call(getDoc, cupboardRef);

    if (cupboardDoc.exists) {
      yield call(() =>
        updateDoc(cupboardRef, {
          items: [],
          lastUpdated: serverTimestamp(),
          lastUpdatedBy: profileID,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Cupboard Reset',
        text2: 'Your cupboard has been cleared.',
      });
    } else {
      Toast.show({
        type: 'warning',
        text1: 'No Cupboard Found',
        text2: 'Could not find a cupboard to reset.',
      });
    }
  } catch (error) {
    yield put({type: 'CUPBOARD_RESET_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Reset Failed',
      text2: 'Your cupboard could not be reset. Please try again later.',
    });
  }
}

export default function* cupboardSaga() {
  yield takeLatest('FETCH_CUPBOARD', fetchCupboard);
  yield takeLatest('ADD_ITEM_TO_CUPBOARD', addItemToCupboard);
  yield takeLatest('UPDATE_ITEM_IN_CUPBOARD', updateItemInCupboard);
  yield takeLatest('DELETE_ITEM_FROM_CUPBOARD', deleteItemFromCupboard);
  yield takeLatest('BATCH_TO_CUPBOARD', batchToCupboard);
  yield takeLatest('BATCH_ADD_TO_CUPBOARD', batchAddToCupboard);
  yield takeLatest('RESET_CUPBOARD', resetCupboard);
}
