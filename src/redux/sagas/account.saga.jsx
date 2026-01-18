//*account.saga.jsx
import {put, takeLatest, call, all} from 'redux-saga/effects';
import {
  getFirestore,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';

const db = getFirestore(getApp());

// New Process
function* fetchAccount(action) {
  const {account, id} = action.payload;

  try {
    const accountRef = doc(db, 'accounts', account);
    const accountDoc = yield call(getDoc, accountRef);

    if (accountDoc.exists) {
      const accountData = accountDoc.data();

      const isAllowed = accountData?.allowedUsers?.includes(id);

      if (isAllowed) {
        yield put({
          type: 'SET_ACCOUNT',
          payload: {
            ...accountData,
            lastUpdated:
              accountData?.lastUpdated?.toDate?.().toISOString() ?? null,
            createdOn: accountData?.createdOn?.toDate?.().toISOString() ?? null,
          },
        });
      } else {
        yield put({type: 'SET_ACCOUNT', payload: null});
      }
    } else {
      yield put({type: 'SET_ACCOUNT', payload: null});
    }
  } catch (error) {
    yield put({type: 'ACCOUNT_FETCH_FAILED', payload: error.message});
  }
}

// Needs update
function* fetchAllowedProfiles(action) {
  const {allowedUsers} = action.payload;
  try {
    const profilesPromises = allowedUsers.map(userId =>
      call(getDoc, doc(db, 'profiles', userId)),
    );

    const profilesSnapshots = yield all(profilesPromises);

    const allowedProfiles = profilesSnapshots
      .map(snapshot => {
        if (!snapshot.exists) return null;

        const profileData = snapshot.data();
        return {
          id: snapshot.id,
          firstName: profileData?.firstName || '',
          lastName: profileData?.lastName || '',
          onlineName: profileData?.onlineName || '',
          email: profileData?.email || '',
          role: profileData?.role || 'user',
        };
      })
      .filter(Boolean);

    yield put({type: 'SET_ALLOWED_PROFILES', payload: allowedProfiles});
  } catch (error) {
    // console.error('[Saga] ❌ Fetch Allowed Profiles Error:', error);
    yield put({type: 'FETCH_ALLOWED_PROFILES_FAILED', payload: error.message});
  }
}

function* updateAccount(action) {
  const {profileID, accountID, updatedData} = action.payload;
  try {
    const accountRef = doc(db, 'accounts', accountID);
    const updatedAccount = {
      ...updatedData,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: profileID,
    };

    yield call(updateDoc, accountRef, updatedAccount);
    yield put({type: 'UPDATE_ACCOUNT_SUCCESS', payload: updatedAccount});
  } catch (error) {
    // console.error('[Saga] ❌ Update Profile Error:', error);
    yield put({type: 'UPDATE_ACCOUNT_FAILED', payload: error.message});
  }
}

function* countUpDaily(action) {
  const {profileID, accountID, updatedData} = action.payload;

  try {
    const accountRef = doc(db, 'accounts', accountID);
    const updatedAccount = {
      ...updatedData,
      lastUpdated: serverTimestamp(),
      lastUpdatedBy: profileID,
    };

    yield call(updateDoc, accountRef, updatedAccount);
    yield put({type: 'DAILY_COUNTUP_SUCCESS', payload: updatedAccount});
  } catch (error) {
    // console.error('[Saga] ❌ Update Profile Error:', error);
    yield put({type: 'DAILY_COUNTUP_FAILED', payload: error.message});
  }
}

export default function* accountSaga() {
  yield takeLatest('FETCH_ACCOUNT', fetchAccount);
  yield takeLatest('FETCH_ALLOWED_PROFILES', fetchAllowedProfiles);
  yield takeLatest('UPDATE_ACCOUNT', updateAccount);
  yield takeLatest('COUNT_UP_DAILY', countUpDaily);
}
