//* signup.saga.jsx

import {put, takeLatest, call} from 'redux-saga/effects';
import {getFirestore, setDoc, doc} from '@react-native-firebase/firestore';
import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';

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

function* createNewAccount(action) {
  try {
    const {userID, profileID} = action.payload;
    const accountID = uuid.v4();
    const cupboardID = uuid.v4();
    const shoppingCartID = uuid.v4();
    const recipeBoxID = uuid.v4();
    const favoriteItemsID = uuid.v4();
    const joinCode = uuid.v4().replace(/-/g, '');

    const newAccount = {
      allowedUsers: [userID],
      createdOn: new Date().toISOString(),
      cupboardID: cupboardID,
      favoriteItemsID: favoriteItemsID,
      id: accountID,
      isActive: true,
      joinCode: joinCode,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userID,
      owner: userID,
      recipeBoxID: recipeBoxID,
      shoppingCartID: shoppingCartID,
      subType: 'Free',
    };

    yield call(setDoc, doc(db, 'accounts', accountID), newAccount);

    const newShopping = {
      id: shoppingCartID,
      accountID: accountID,
      createdOn: new Date().toISOString(),
      // items: [''],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userID,
    };

    yield call(setDoc, doc(db, 'shoppingCarts', shoppingCartID), newShopping);

    const newCupboard = {
      id: cupboardID,
      accountID: accountID,
      createdOn: new Date().toISOString(),
      // items: [''],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userID,
    };

    yield call(setDoc, doc(db, 'cupboards', cupboardID), newCupboard);

    const newRecipeBox = {
      id: recipeBoxID,
      accountID: accountID,
      createdOn: new Date().toISOString(),
      // items: [''],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userID,
    };

    yield call(setDoc, doc(db, 'recipeBoxes', recipeBoxID), newRecipeBox);

    const newFavoriteItems = {
      id: favoriteItemsID,
      accountID: accountID,
      createdOn: new Date().toISOString(),
      // items: [''],
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: userID,
    };

    yield call(
      setDoc,
      doc(db, 'favoriteItems', favoriteItemsID),
      newFavoriteItems,
    );

    yield call(
      setDoc,
      doc(db, 'profiles', userID),
      {
        account: accountID,
        role: 'owner',
        lastUpdated: new Date().toISOString(),
      },
      {merge: true},
    );

    yield put({
      type: 'FETCH_ACCOUNT',
      payload: {account: accountID, id: userID},
    });

    yield put({
      type: 'FETCH_SHOP_CART',
      payload: {shoppingCartID: shoppingCartID},
    });
    yield put({type: 'FETCH_CUPBOARD', payload: {cupboardID: cupboardID}});

    yield put({type: 'SIGNUP_SUCCESS'});
  } catch (error) {
    console.error('An Error occurred during account creation:', error.message);
  }
}

function* joinAccount(action) {}

export default function* signupSaga() {
  yield takeLatest('SIGNUP_REQUEST', createNewUser);
  yield takeLatest('CREATE_NEW_ACCOUNT', createNewAccount);
  yield takeLatest('JOIN_ACCOUNT', joinAccount);
}
