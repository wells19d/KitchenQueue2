//* signup.saga.jsx

import {put, takeLatest, call} from 'redux-saga/effects';
import {getFirestore, setDoc, doc} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';

const db = getFirestore(getApp());
const auth = getAuth(getApp());

function* createNewUser(action) {
  try {
    // grab the payload
    const {email, password} = action.payload;

    // Checks if the email is in use, if not, it creates that user.
    const userCredential = yield call(
      [auth, auth.createUserWithEmailAndPassword],
      email,
      password,
    );

    //build the user object
    const user = userCredential.user;

    // send the user an email verification
    yield call([user, user.sendEmailVerification]);

    // need to confirm the user is created and grab the uid, not sure if this is correct.
    const newProfile = {
      account: null,
      email: email,
      firstName: null,
      id: user.uid,
      isActive: true,
      lastName: null,
      lastUpdated: new Date().toISOString(),
      onlineName: null,
      pictureApproved: false,
      pictureURL: '',
      role: 'n/a',
      onboarding: {
        onboardDisabled: false, // after a certain number of steps, user can turn off onboarding
        onboardingAllowedDisabled: false, // if true, user can turn off onboarding
        lastStepCompleted: 'created-userProfile', // this is the last step completed in onboarding
        lastStepCompletedOn: new Date().toISOString(), // this is the date the last step was completed
        onboardingCompleted: false, // this is true when the user has completed all steps
        completedOn: null, // this is the date the last step was completed
        forceShowFTU: false, // this lets the user force to show the ftu again
      },
    };

    // Create the profile document in Firestore
    yield call(setDoc, doc(db, 'profiles', user.uid), newProfile);

    yield call([auth, auth.signOut]);
    yield put({type: 'LOGOUT_AND_CLEAR'});
  } catch (error) {
    console.error('An Error occurred during signup process:', error.message);
  }
}

export default function* signupSaga() {
  yield takeLatest('SIGNUP_REQUEST', createNewUser);
}
