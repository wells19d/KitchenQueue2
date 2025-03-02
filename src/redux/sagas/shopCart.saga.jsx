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
  serverTimestamp,
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
    } else {
      yield put({type: 'SET_SHOP_CART', payload: null});
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_LOAD_FAILED', payload: error.message});
  }
}

function* addItemToShopCart(action) {
  const {shoppingCartID, newItem} = action.payload;
  try {
    // Reference the shopCart document using shoppingCartID as the document ID
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      // Append new item with a generated UUID and timestamp
      const updatedItems = [
        ...(shopCartData.items || []),
        {...newItem, itemId: uuid.v4(), itemDate: new Date().toISOString()},
      ];

      // Update Firestore shopCart document with new items array
      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        }),
      );

      // Reload shopCart data
      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});

      // Show success toast message
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
  const {shoppingCartID, updatedItem, updateType} = action.payload;
  try {
    // Reference the shopCart document using shoppingCartID as the document ID
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      // Update the correct item in the items array
      const updatedItems = shopCartData?.items?.map(item =>
        item.itemId === updatedItem.itemId ? updatedItem : item,
      );

      // Update Firestore shopCart document with new items array
      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        }),
      );

      // Reload shopCart data
      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});

      // Handle different update types for toast messages
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
  const {shoppingCartID, itemId, itemName} = action.payload;
  try {
    // Reference the shopCart document using shoppingCartID as the document ID
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      // Remove the specified item from the items array
      const updatedItems = shopCartData?.items?.filter(
        item => item.itemId !== itemId,
      );

      // Update Firestore shopCart document with the new filtered items array
      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        }),
      );

      // Reload shopCart data
      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});

      // Show success toast message
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
  const {shoppingCartID, items} = action.payload;

  try {
    // Reference the shopCart document using shoppingCartID as the document ID
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      const shopCartData = shopCartDoc.data();

      // Remove all items that match those in the `items` list
      const updatedItems = shopCartData?.items?.filter(
        item => !items.some(cartItem => cartItem.itemId === item.itemId),
      );

      // Update Firestore shopCart document with the new filtered items array
      yield call(() =>
        updateDoc(shopCartRef, {
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        }),
      );

      // Reload shopCart data
      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});
    }
  } catch (error) {
    yield put({type: 'SHOP_CART_DELETE_LIST_FAILED', payload: error.message});
  }
}

function* batchToShopCart(action) {
  const {shoppingCartID, items} = action.payload;

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
            itemDate: new Date().toISOString(), // ✅ Fix: Use Firestore new Date().toISOString()
            quantity: 1,
            status: 'shopping-cart',
          };

          updatedItems.push(newItem);
        }
      });

      batch.update(shopCartRef, {
        items: updatedItems,
        lastUpdated: new Date().toISOString(),
      });

      yield call(() => batch.commit());

      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});

      Toast.show({
        type: 'success',
        text1: 'Items Added',
        text2: `Batch items were added to the shopping cart.`,
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
  const {shoppingCartID} = action.payload;
  try {
    // Reference the shopCart document using shoppingCartID as the document ID
    const shopCartRef = doc(db, 'shoppingCarts', shoppingCartID);
    const shopCartDoc = yield call(getDoc, shopCartRef);

    if (shopCartDoc.exists) {
      // Update shopCart to reset items
      yield call(() =>
        updateDoc(shopCartRef, {
          items: [],
          lastUpdated: new Date().toISOString(),
        }),
      );

      // Reload the updated shopCart
      yield put({type: 'LOAD_SHOP_CART', payload: {shoppingCartID}});

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
  yield takeLatest('LOAD_SHOP_CART', fetchShopCart);
  yield takeLatest('ADD_ITEM_TO_SHOP_CART', addItemToShopCart);
  yield takeLatest('UPDATE_ITEM_IN_SHOP_CART', updateItemInShopCart);
  yield takeLatest('DELETE_ITEM_FROM_SHOP_CART', deleteItemFromShopCart);
  yield takeLatest('DELETE_LIST_FROM_SHOP_CART', deleteListFromShopCart);
  yield takeLatest('BATCH_TO_SHOP_CART', batchToShopCart);
  yield takeLatest('RESET_SHOP_CART', resetShopCart);
}
