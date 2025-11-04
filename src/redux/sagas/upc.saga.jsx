//* upc.saga.jsx

import {takeLatest, put, call} from 'redux-saga/effects';
import {fetchRemoteKeys} from '../../../firebase.config';

function* fetchUPCData(action) {
  const {barcode} = action.payload;

  try {
    const remoteKeys = yield call(fetchRemoteKeys);
    const apiKey = remoteKeys.upc.apiKey;
    const url = `https://api.kitchen-queue.com/food?api_key=${apiKey}&upc=${barcode}`;

    const response = yield call(fetch, url);
    const data = yield call([response, 'json']);

    if (!response.ok) {
      throw new Error(data?.error || 'UPC lookup failed');
    }

    yield put({type: 'SET_UPC_DATA', payload: data});
  } catch (error) {
    console.log('UPC API Error:', error.message);
    yield put({type: 'UPC_API_FETCH_FAILED', payload: error.message});
  }
}

export default function* upcSaga() {
  yield takeLatest('FETCH_UPC_DATA', fetchUPCData);
}
