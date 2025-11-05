//* upc.saga.jsx

import {takeLatest, put, call} from 'redux-saga/effects';
import {fetchRemoteKeys} from '../../../firebase.config';

function* fetchUPCData(action) {
  const {barcode, allowance, profileID, accountID} = action.payload;

  const remoteKeys = yield call(fetchRemoteKeys);
  const apiKey = remoteKeys.upc.apiKey;
  const url = `https://api.kitchen-queue.com/food?api_key=${apiKey}&upc=${barcode}`;

  try {
    const response = yield call(fetch, url);

    if (response.ok) {
      const data = yield response.json();

      if (data?.fatsecret?.food) {
        yield put({type: 'SET_UPC_DATA', payload: data});
        yield put({
          type: 'COUNT_UP_DAILY',
          payload: {
            updatedData: {
              dailyUPCCounter: allowance + 1,
            },
            profileID,
            accountID,
          },
        });
      } else {
        yield put({
          type: 'UPC_API_FETCH_FAILED',
          payload: `No food found for UPC: ${barcode}`,
        });
      }
    } else {
      yield put({
        type: 'UPC_API_FETCH_FAILED',
        payload: `API error: ${response.status}`,
      });
    }
  } catch (error) {
    yield put({type: 'UPC_API_FETCH_FAILED', payload: error.message});
  }
}

export default function* upcSaga() {
  yield takeLatest('FETCH_UPC_DATA', fetchUPCData);
}
