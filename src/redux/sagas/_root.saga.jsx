import {all, fork} from 'redux-saga/effects';
import userSaga from './user.saga';
import profileSaga from './profile.saga';
import accountSaga from './account.saga';
import shoppingSaga from './shopCart.saga';
import cupboardSaga from './cupboard.saga';
import deviceSaga from './device.saga';
import {invitesSaga} from './invites.saga';
import edamamSaga from './edamam.saga';
import loginSaga from './login.saga';
import signupSaga from './signup.saga';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(profileSaga),
    fork(accountSaga),
    fork(shoppingSaga),
    fork(cupboardSaga),
    fork(deviceSaga),
    fork(invitesSaga),
    fork(edamamSaga),
    fork(loginSaga),
    fork(signupSaga),
  ]);
}
