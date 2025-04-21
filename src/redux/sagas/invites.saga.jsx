// invites.saga.jsx
import {put, call, takeLatest} from 'redux-saga/effects';
import {
  getFirestore,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';

const db = getFirestore(getApp());

function* queueInviteSaga(action) {
  const {invite, accountID, resolve, reject} = action.payload;

  try {
    const accountRef = doc(db, 'accounts', accountID);
    const accountSnap = yield call(getDoc, accountRef);
    if (!accountSnap.exists) throw new Error('Account not found.');

    const accountData = accountSnap.data();
    const currentUsers = accountData.allowedUsers?.length || 0;
    const currentInviteCodes = accountData.accountInvites || [];

    const now = Date.now();
    const cutoff = now - 7 * 24 * 60 * 60 * 1000; // 7 days

    let activeInvites = [];
    let reusedInvite = null;
    let expiredCodes = [];

    // 🔍 Check each invite code
    for (let code of currentInviteCodes) {
      const ref = doc(db, 'accountInvites', code);
      const snap = yield call(getDoc, ref);

      if (snap.exists) {
        const data = snap.data();
        const expireTime = new Date(data.toExpire).getTime();

        if (expireTime < cutoff) {
          // expired, delete it
          yield call(deleteDoc, ref);
          expiredCodes.push(code);
        } else {
          // reused email logic
          if (data.email === invite.email) reusedInvite = data;
          activeInvites.push(data);
        }
      } else {
        // dangling ref
        expiredCodes.push(code);
      }
    }

    // 🧹 Clean up account's invite array
    if (expiredCodes.length > 0) {
      const cleanedCodes = currentInviteCodes.filter(
        code => !expiredCodes.includes(code),
      );
      yield call(updateDoc, accountRef, {accountInvites: cleanedCodes});
    }

    // 🔁 Reuse existing invite
    if (reusedInvite) {
      const inviteRef = doc(db, 'accountInvites', reusedInvite.inviteCode);
      const updated = {
        ...reusedInvite,
        toExpire: new Date().toISOString(),
      };
      yield call(setDoc, inviteRef, updated);
      yield put({type: 'SET_EXISTING_INVITE', payload: updated});
      resolve?.({existing: true, invite: updated});
      return;
    }

    // ✅ Now check available slots AFTER cleaning
    const cleanedInviteCodes = currentInviteCodes.filter(
      code => !expiredCodes.includes(code),
    );
    const cleanedInviteCount = activeInvites.length;
    const slotsRemaining = Math.max(0, 4 - (currentUsers + cleanedInviteCount));

    if (slotsRemaining <= 0) {
      yield put({type: 'SET_EXCEEDING_LIMITS'});
      yield put({type: 'SET_EXISTING_INVITE', payload: null});
      resolve?.({existing: false, invite: null, exceeding: true});
      return;
    }

    // ✳️ Create new invite
    const inviteRef = doc(db, 'accountInvites', invite.inviteCode);
    yield call(setDoc, inviteRef, invite);

    const updatedInviteCodes = [...cleanedInviteCodes, invite.inviteCode];
    yield call(updateDoc, accountRef, {
      accountInvites: updatedInviteCodes,
    });

    yield put({type: 'SET_EXISTING_INVITE', payload: invite});
    resolve?.({existing: false, invite});
  } catch (error) {
    console.error('🔥 queueInviteSaga error:', error);
    yield put({type: 'INVITE_ACTION_FAILED', payload: error.message});
    reject?.(error);
  }
}

export function* invitesSaga() {
  yield takeLatest('QUEUE_INVITE_REQUEST', queueInviteSaga);
}
