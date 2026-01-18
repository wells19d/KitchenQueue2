//* RealTimeAccounts.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount, useProfile} from '../../hooks/useHooks';

const useRealTimeAccounts = enabled => {
  const dispatch = useDispatch();
  const profile = useProfile();
  const db = getFirestore();

  useEffect(() => {
    if (!enabled || !profile?.account) {
      return;
    }

    const accountRef = doc(db, 'accounts', profile.account);

    const unsubscribe = onSnapshot(
      accountRef,
      snapshot => {
        if (snapshot.exists) {
          const accountData = snapshot.data();
          const account = {
            ...accountData,
            lastUpdated:
              accountData?.lastUpdated?.toDate?.().toISOString() ?? null,
            createdOn: accountData?.createdOn?.toDate?.().toISOString() ?? null,
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
  }, [dispatch, profile?.account, db, enabled]); // ✅ Removed `storedAccount`
};

export default useRealTimeAccounts;
