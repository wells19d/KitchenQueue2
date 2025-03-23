//* RealTimeAccounts.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount, useProfile} from '../../hooks/useHooks';

const useRealTimeAccounts = () => {
  const dispatch = useDispatch();
  const profile = useProfile();
  const db = getFirestore();

  useEffect(() => {
    if (!profile?.account) {
      return;
    }

    console.log(`🔄 Fetching Account data from Firestore`);
    const accountRef = doc(db, 'accounts', profile.account);

    const unsubscribe = onSnapshot(
      accountRef,
      snapshot => {
        if (snapshot.exists) {
          const accountData = snapshot.data();
          const account = {
            ...accountData,
            lastUpdated: accountData?.lastUpdated || null, // ✅ No more toDate()
            createdOn: accountData?.createdOn || null, // ✅ No more toDate()
          };
          dispatch({type: 'SET_ACCOUNT', payload: account});
        } else {
          dispatch({type: 'SET_ACCOUNT', payload: null});
        }
      },
      error => {
        dispatch({type: 'ACCOUNT_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, profile?.account, db]); // ✅ Removed `storedAccount`
};

export default useRealTimeAccounts;
