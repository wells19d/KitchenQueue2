//* login.saga.jsx
import {put, takeLatest, select, call} from 'redux-saga/effects';

// Step 1: Fetch profile using user.uid
function* handleLogin(action) {
  try {
    const uid = action.payload;

    // ✅ Step 1: Fetch Profile
    yield put({type: 'FETCH_PROFILE', payload: {uid}});

    // Wait until profile is set in Redux
    const profile = yield call(waitForProfile);

    // ✅ Step 2: Fetch Account using profile.account & profile.id
    const {account, id} = profile;
    yield put({type: 'FETCH_ACCOUNT', payload: {account, id}});

    // Wait until account is set in Redux
    const accountData = yield call(waitForAccount);

    // ✅ Step 3: Fetch shoppingCart / cupboard / favorites
    const {shoppingCartID, cupboardID, favoriteItemsID} = accountData;
    yield put({type: 'FETCH_SHOP_CART', payload: {shoppingCartID}});
    yield put({type: 'FETCH_CUPBOARD', payload: {cupboardID}});
    yield put({type: 'FETCH_FAVORITES', payload: {favoriteItemsID}});
  } catch (error) {
    yield put({type: 'LOGIN_SEQUENCE_FAILED', payload: error.message});
  }
}

function* waitForProfile() {
  while (true) {
    const profile = yield select(state => state.profile.profile);
    if (profile) return profile;
    yield new Promise(resolve => setTimeout(resolve, 50));
  }
}

function* waitForAccount() {
  while (true) {
    const account = yield select(state => state.account.account);
    if (account) return account;
    yield new Promise(resolve => setTimeout(resolve, 50));
  }
}

export default function* loginSaga() {
  yield takeLatest('START_LOGIN', handleLogin);
}
