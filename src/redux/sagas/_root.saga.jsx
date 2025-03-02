//*_root.saga.jsx
import {all} from 'redux-saga/effects';
import userSaga from './user.saga';
import profileSaga from './profile.saga';
import accountSaga from './account.saga';
import shoppingSaga from './shopCart.saga';
import cupboardSaga from './cupboard.saga';
import deviceSaga from './device.saga';
import {invitesSaga} from './invites.saga';
import edamamSaga from './edamam.saga';

export default function* rootSaga() {
  yield all([
    userSaga(),
    profileSaga(),
    accountSaga(),
    shoppingSaga(),
    cupboardSaga(),
    deviceSaga(),
    invitesSaga(),
    edamamSaga(),
  ]);
}
