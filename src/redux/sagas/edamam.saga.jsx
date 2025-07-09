//* edaman.saga.jsx
import {takeLatest, call, put} from 'redux-saga/effects';
import {fetchRemoteKeys} from '../../../firebase.config';

function* fetchFoodData(action) {
  const {barcode, allowance, profileID, accountID} = action.payload;

  const {food} = yield call(fetchRemoteKeys);
  const appId = food.appId;
  const appKey = food.appKey;

  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&upc=${barcode}`;

  try {
    const response = yield call(fetch, url);

    if (response.ok) {
      const data = yield response.json();

      if (data.hints && data.hints.length > 0) {
        yield put({type: 'SET_FOOD_DATA', payload: data});
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
          type: 'FOOD_API_FETCH_FAILED',
          payload: `No food found for UPC: ${barcode}`,
        });
      }
    } else {
      yield put({
        type: 'FOOD_API_FETCH_FAILED',
        payload: `API error: ${response.status}`,
      });
    }
  } catch (error) {
    yield put({type: 'FOOD_API_FETCH_FAILED', payload: error.message});
  }
}

// Watcher saga for Edamam API actions
export default function* edamamSaga() {
  yield takeLatest('FETCH_FOOD_DATA', fetchFoodData);
}
