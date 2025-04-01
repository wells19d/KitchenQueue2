//* user.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
import {getAuth} from '@react-native-firebase/auth';
import {persistor} from '../../../store';

const auth = getAuth();

const getErrorMessage = error => {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The email or password provided is incorrect. Please try again.';
    case 'auth/user-disabled':
      return 'The user account has been disabled. Please contact support.';
    case 'auth/email-already-in-use':
      return 'The email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid. Please check and try again.';
    default:
      return 'An unknown error occurred. Please try again later.';
  }
};

// New Process
function* loginUser(action) {
  try {
    const {email, password} = action.payload;

    const userCredential = yield call(
      [auth, auth.signInWithEmailAndPassword],
      email,
      password,
    );

    const user = userCredential?.user;

    if (user?.emailVerified) {
      yield put({type: 'SET_USER', payload: user});
      yield put({type: 'START_LOGIN', payload: user.uid});
    } else {
      yield put({
        type: 'LOGIN_FAILED',
        payload: 'Email is not verified. Please verify your email to log in.',
      });
    }
  } catch (error) {
    const friendlyMessage = getErrorMessage(error);
    yield put({type: 'LOGIN_FAILED', payload: friendlyMessage});
  }
}

// No changes needed
function* logoutUser() {
  try {
    yield call([auth, auth.signOut]);
    yield put({type: 'UNSET_USER'});
  } catch (error) {
    const friendlyMessage = getErrorMessage(error);
    yield put({type: 'LOGOUT_FAILED', payload: friendlyMessage});
  }
}

// No changes needed
function* logOutAndClear() {
  try {
    yield call([auth, auth.signOut]);
    yield put({type: 'UNSET_USER'});
    yield put({type: 'RESET_ALL_STATE'});
    yield call([persistor, persistor.purge]);
    yield call([persistor, persistor.flush]);
  } catch (error) {
    const friendlyMessage = getErrorMessage(error);
    yield put({type: 'LOGOUT_FAILED', payload: friendlyMessage});
  }
}

export default function* userSaga() {
  yield takeLatest('LOGIN_REQUEST', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
  yield takeLatest('LOGOUT_AND_CLEAR', logOutAndClear);
}
