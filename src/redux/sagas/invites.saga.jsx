//* invites.saga.jsx
import {put, call, takeLatest} from 'redux-saga/effects';
import {
  getFirestore,
  getDoc,
  updateDoc,
  doc,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';

const db = getFirestore(getApp());

function* addInviteSaga(action) {
  if (!action.payload?.email) {
    console.error('Email is missing in action payload.');
    return;
  }
  try {
    const docRef = doc(db, 'accountInvites', 'bGk0rcOM1lpPyV1WdG7c');
    const docSnapshot = yield call(getDoc, docRef);

    let updatedInvites = [];

    if (docSnapshot.exists) {
      const docData = docSnapshot.data();
      updatedInvites = docData.invites
        ? [...docData.invites, action.payload]
        : [action.payload];
    } else {
      updatedInvites = [action.payload];
    }

    yield call(() => updateDoc(docRef, {invites: updatedInvites}));
  } catch (error) {
    console.error('Failed to add invite:', error);
  }
}

function* checkInvitesSaga(action) {
  try {
    const docRef = doc(db, 'accountInvites', 'bGk0rcOM1lpPyV1WdG7c');
    const docSnapshot = yield call(getDoc, docRef);

    if (docSnapshot.exists) {
      const {invites = []} = docSnapshot.data();
      const foundInvite = invites.find(
        invite => invite.email === action.payload.email,
      );

      if (foundInvite) {
        action.payload.resolve(foundInvite); // Resolve with the found invite
        yield put({type: 'SET_EXISTING_INVITE', payload: foundInvite});
      } else {
        action.payload.resolve(null); // Resolve with null if no invite found
        yield put({type: 'INVITE_NOT_FOUND'});
      }
    } else {
      action.payload.resolve(null); // Resolve with null if no doc found
      yield put({type: 'INVITE_NOT_FOUND'});
    }
  } catch (error) {
    console.error('Error checking invites:', error);
    action.payload.reject(error); // Reject with the error
    yield put({type: 'CHECK_INVITES_FAILED', payload: error.message});
  }
}

function* updateInviteSaga(action) {
  if (!action.payload?.email) {
    console.error('Email is missing in action payload.');
    return;
  }
  try {
    const docRef = doc(db, 'accountInvites', 'bGk0rcOM1lpPyV1WdG7c');
    const docSnapshot = yield call(getDoc, docRef);

    if (!docSnapshot.exists) {
      console.error('Document not found.');
      return;
    }

    const {invites = []} = docSnapshot.data();
    const updatedInvites = invites.map(invite =>
      invite.email === action.payload.email
        ? {...invite, toExpire: invite.toExpire || new Date().toISOString()}
        : invite,
    );

    yield call(updateDoc, docRef, {invites: updatedInvites});
    yield put({type: 'INVITE_UPDATED', payload: action.payload.email});
  } catch (error) {
    console.error('Failed to update invite:', error);
    yield put({type: 'UPDATE_INVITE_FAILED', payload: error.message});
  }
}

function* deleteInviteSaga(action) {
  if (!action.payload?.email) {
    console.error('Email is missing in action payload.');
    return;
  }
  try {
    const docRef = doc(db, 'accountInvites', 'bGk0rcOM1lpPyV1WdG7c');
    const docSnapshot = yield call(getDoc, docRef);

    if (!docSnapshot.exists) {
      console.error('Document not found.');
      return;
    }

    const {invites = []} = docSnapshot.data();
    const updatedInvites = invites.filter(
      invite => invite.email !== action.payload.email,
    );

    yield call(updateDoc, docRef, {invites: updatedInvites});
    yield put({type: 'INVITE_DELETED', payload: action.payload.email});
  } catch (error) {
    console.error('Failed to delete invite:', error);
    yield put({type: 'DELETE_INVITE_FAILED', payload: error.message});
  }
}

// Watcher saga
export function* invitesSaga() {
  yield takeLatest('ADD_INVITE', addInviteSaga);
  yield takeLatest('CHECK_INVITES', checkInvitesSaga);
  yield takeLatest('UPDATE_INVITE', updateInviteSaga);
  yield takeLatest('DELETE_INVITE', deleteInviteSaga);
}
