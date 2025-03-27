//*shopCart.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
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

const db = getFirestore(getApp());

function* fetchShopCart(action) {
  const {shoppingCartID} = action.payload;
  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      let shopCartData = shopCartDoc.data();

      if (!shopCartData.items) {
        shopCartData = {...shopCartData, items: []};

        yield call(() =>
          updateDoc(shopCartRef, {
            items: [],
            lastUpdated: new Date().toISOString(),
          }),
        );
      }

      let shopCart = {
        ...shopCartData,
        lastUpdated: shopCartData?.lastUpdated || null,
      };

      yield put({type: 'SET_SHOP_CART', payload: shopCart});
      console.log('ShopCart Set');
    } else {
      yield put({type: 'SET_SHOP_CART', payload: null});
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_SET_FAILED', payload: error.message});
  }
}

function* addItemToShopCart(action) {
  const {shoppingCartID, newItem, profileID} = action.payload;
  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      const updatedItems = [
        ...(shopCartData.items || []),
        {...newItem, itemId: uuid.v4(), itemDate: new Date().toISOString()},
      ];

      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});

      Toast.show({
        type: 'success',
        text1: 'Item Added',
        text2: `${newItem.itemName} added to the shopping list.`,
      });
    } else {
      yield put({
        type: 'SHOP_CART_ADD_ITEM_FAILED',
        payload: 'Shopping cart not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Add Item',
        text2: 'Shopping cart not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_ADD_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Add Item',
      text2: `${newItem.itemName} could not be added. Please try again later.`,
    });
  }
}

function* updateItemInShopCart(action) {
  const {shoppingCartID, updatedItem, updateType, profileID} = action.payload;
  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();
      const updatedItems = shopCartData?.items?.map(item =>
        item.itemId === updatedItem.itemId ? updatedItem : item,
      );

      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});

      if (updateType === 'toCart') {
        Toast.show({
          type: 'success',
          text1: 'Item Added',
          text2: `${updatedItem.itemName} moved to the shopping cart.`,
        });
      } else if (updateType === 'toList') {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} moved to the shopping list.`,
        });
      } else if (updateType === 'toCupboard') {
        // No toast needed, as the cupboard logic handles it
      } else {
        Toast.show({
          type: 'success',
          text1: 'Item Updated',
          text2: `${updatedItem.itemName} updated to the shopping list.`,
        });
      }
    } else {
      yield put({
        type: 'SHOP_CART_UPDATE_ITEM_FAILED',
        payload: 'Shopping cart not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Update Item',
        text2: 'Shopping cart not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_UPDATE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Update Item',
      text2: `${updatedItem.itemName} could not be updated. Please try again later.`,
    });
  }
}

function* deleteItemFromShopCart(action) {
  const {shoppingCartID, itemId, itemName, profileID} = action.payload;
  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      const updatedItems = shopCartData?.items?.filter(
        item => item.itemId !== itemId,
      );

      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});

      Toast.show({
        type: 'success',
        text1: 'Item Deleted',
        text2: `${itemName} removed from the shopping cart.`,
      });
    } else {
      yield put({
        type: 'SHOP_CART_DELETE_ITEM_FAILED',
        payload: 'Shopping cart not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Failed to Delete Item',
        text2: 'Shopping cart not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_DELETE_ITEM_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Failed to Delete Item',
      text2: `${itemName} could not be removed. Please try again later.`,
    });
  }
}

function* deleteListFromShopCart(action) {
  const {shoppingCartID, items, profileID} = action.payload;

  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      const updatedItems = shopCartData?.items?.filter(
        item => !items.some(cartItem => cartItem.itemId === item.itemId),
      );

      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_DELETE_LIST_FAILED', payload: error.message});
  }
}

function* batchToShopping(action) {
  const {shoppingCartID, items, status, profileID} = action.payload;

  try {
    yield put({type: 'SHOP_CART_BATCH_ADD_START'});

    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();
      const batch = writeBatch(db);
      let updatedItems = [...(shopCartData.items || [])];

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
            measurement: measurement || '',
            category: category || '',
            notes: notes || '',
            itemId: uuid.v4(),
            itemDate: new Date().toISOString(),
            quantity: 1,
            status:
              status === 'shopping-list' ? 'shopping-list' : 'shopping-cart',
          };

          updatedItems.push(newItem);
        }
      });

      batch.update(shopCartRef, {
        items: updatedItems,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: profileID,
      });

      yield call(() => batch.commit());

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});

      Toast.show({
        type: 'success',
        text1: 'Items Added',
        text2: `Items were added to your ${
          status === 'shopping-list' ? 'shopping list' : 'shopping cart'
        }.`,
      });

      yield put({type: 'SHOP_CART_BATCH_ADD_SUCCESS'});
    } else {
      yield put({
        type: 'SHOP_CART_BATCH_ADD_FAILED',
        payload: 'Shopping cart not found.',
      });

      Toast.show({
        type: 'danger',
        text1: 'Batch Add Failed',
        text2: 'Shopping cart not found. Please try again later.',
      });
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_BATCH_ADD_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Batch Add Failed',
      text2:
        'Items could not be added to the shopping cart. Please try again later.',
    });
  }
}

function* resetShopCart(action) {
  const {shoppingCartID, profileID} = action.payload;
  try {
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      yield call(() =>
        updateDoc(shopCartRef, {
          items: [],
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profileID,
        }),
      );

      yield put({type: 'SET_SHOP_CART', payload: {shoppingCartID}});

      Toast.show({
        type: 'success',
        text1: 'Shopping List Reset',
        text2: 'Your shopping list has been cleared.',
      });
    } else {
      Toast.show({
        type: 'warning',
        text1: 'No Shopping List Found',
        text2: 'Could not find a shopping list to reset.',
      });
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_RESET_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Reset Failed',
      text2: 'Your shopping list could not be reset. Please try again later.',
    });
  }
}

export default function* shopCartSaga() {
  yield takeLatest('FETCH_SHOP_CART', fetchShopCart);
  yield takeLatest('ADD_ITEM_TO_SHOP_CART', addItemToShopCart);
  yield takeLatest('UPDATE_ITEM_IN_SHOP_CART', updateItemInShopCart);
  yield takeLatest('DELETE_ITEM_FROM_SHOP_CART', deleteItemFromShopCart);
  yield takeLatest('DELETE_LIST_FROM_SHOP_CART', deleteListFromShopCart);
  yield takeLatest('BATCH_TO_SHOP_CART', batchToShopping);
  yield takeLatest('RESET_SHOP_CART', resetShopCart);
}
