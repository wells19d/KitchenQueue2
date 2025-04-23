//* join.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
import {getFirestore, getDoc, doc} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import moment from 'moment';

const db = getFirestore(getApp());

function* checkJoinAccount(action) {
  const {inviteCode} = action.payload;

  try {
    const inviteRef = doc(db, 'accountInvites', inviteCode);
    const inviteSnap = yield call(getDoc, inviteRef);

    if (inviteSnap.exists) {
      const inviteData = inviteSnap.data();

      const expireMoment = moment
        .utc(inviteData.toExpire)
        .add(7, 'days')
        .startOf('day');
      const nowMoment = moment().startOf('day');
      const isExpired = nowMoment.isSameOrAfter(expireMoment);

      if (!isExpired) {
        yield put({
          type: 'SET_INVITE_DATA',
          payload: inviteData,
        });
      } else {
        yield put({
          type: 'INVITE_EXPIRED',
          payload: {
            error: true,
            msg1: 'Invitation Expired',
            msg2: 'Please check with the account owner.',
          },
        });
      }
    } else {
      yield put({
        type: 'INVITE_NOT_FOUND',
        payload: {
          error: true,
          msg1: 'Invitation Not Found',
          msg2: 'Please check the code and try again.',
        },
      });
    }
  } catch (error) {
    yield put({
      type: 'INVITE_LOOKUP_FAILED',
      payload: {
        error: true,
        msg1: 'Something Went Wrong',
        msg2: 'We couldn’t verify your code. Try again later.',
      },
    });
  }
}

export default function* joinSaga() {
  yield takeLatest('CHECK_JOIN_ACCOUNT', checkJoinAccount);
  // Add other sagas here if needed
}
