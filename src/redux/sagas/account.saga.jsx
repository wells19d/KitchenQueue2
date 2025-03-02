//*account.saga.jsx
import {put, takeLatest, call, all, select} from 'redux-saga/effects';
import {getFirestore, getDoc, doc} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';

const db = getFirestore(getApp());

function* fetchAccount(action) {
  const accountId = action.payload;
  // console.log('[Saga] Fetching account for ID:', accountId);

  try {
    const accountRef = doc(db, 'accounts', accountId);
    const accountDoc = yield call(getDoc, accountRef);

    if (accountDoc.exists) {
      const accountData = accountDoc.data();
      // console.log('[Saga] ✅ Account Data:', accountData);

      // 🚀 Get the current profile from Redux
      const profile = yield select(state => state.profile.profile);

      if (!profile) {
        // console.log(
        //   '[Saga] ❌ No profile found in Redux state, skipping account check',
        // );
        yield put({type: 'SET_ACCOUNT', payload: null});
        return;
      }

      const isAllowed = accountData?.allowedUsers?.includes(profile.id);

      if (isAllowed) {
        // console.log(
        //   `[Saga] ✅ Profile ${profile.id} is allowed in account ${accountId}`,
        // );
        yield put({
          type: 'SET_ACCOUNT',
          payload: {
            ...accountData,
            lastUpdated: accountData?.lastUpdated || null,
            createdOn: accountData?.createdOn || null,
          },
        });
      } else {
        // console.log(
        //   `[Saga] ❌ Profile ${profile.id} is NOT allowed in account ${accountId}`,
        // );
        yield put({type: 'SET_ACCOUNT', payload: null});
      }
    } else {
      // console.log('[Saga] ❌ No account found');
      yield put({type: 'SET_ACCOUNT', payload: null});
    }
  } catch (error) {
    // console.error('[Saga] ❌ Fetch Account Error:', error);
    yield put({type: 'ACCOUNT_FETCH_FAILED', payload: error.message});
  }
}

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

export default function* accountSaga() {
  yield takeLatest('FETCH_ACCOUNT', fetchAccount);
  yield takeLatest('FETCH_ALLOWED_PROFILES', fetchAllowedProfiles);
}
