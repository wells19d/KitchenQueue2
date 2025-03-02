//*profile.saga.jsx
import {put, takeLatest, call} from 'redux-saga/effects';
import Toast from 'react-native-toast-message';
import {
  getFirestore,
  getDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';

const db = getFirestore(getApp());

function* fetchProfile(action) {
  const {uid} = action.payload;
  // console.log('[Saga] Fetching profile for UID:', uid);

  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = yield call(getDoc, profileRef);

    if (profileDoc.exists) {
      const profileData = profileDoc.data();
      // console.log('[Saga] ✅ Profile Data:', profileData);

      yield put({type: 'SET_PROFILE', payload: profileData});

      // 🚀 Fetch account **after** profile is set
      if (profileData?.account) {
        // console.log(
        //   `[Saga] 🚀 Dispatching FETCH_ACCOUNT for: ${profileData.account}`,
        // );
        yield put({type: 'FETCH_ACCOUNT', payload: profileData.account});
      }
    } else {
      // console.log('[Saga] ❌ No profile found');
      yield put({type: 'SET_PROFILE', payload: null});
    }
  } catch (error) {
    // console.error('[Saga] ❌ Fetch Profile Error:', error);
    yield put({type: 'PROFILE_FETCH_FAILED', payload: error.message});
  }
}

function* updateProfile(action) {
  const {userId, updatedData} = action.payload;
  try {
    const profileRef = doc(db, 'profiles', userId);
    const updatedProfile = {
      ...updatedData,
      lastUpdated: new Date().toISOString(),
    };

    yield call(updateDoc, profileRef, updatedProfile);
    yield put({type: 'UPDATE_PROFILE_SUCCESS', payload: updatedProfile});

    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your profile has been updated.',
    });
  } catch (error) {
    // console.error('[Saga] ❌ Update Profile Error:', error);
    yield put({type: 'UPDATE_PROFILE_FAILED', payload: error.message});

    Toast.show({
      type: 'danger',
      text1: 'Profile Update Failed',
      text2: 'Your profile could not be updated.',
    });
  }
}

export default function* profileSaga() {
  yield takeLatest('FETCH_PROFILE', fetchProfile);
  yield takeLatest('UPDATE_PROFILE_REQUEST', updateProfile);
}
