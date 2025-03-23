//* RealTimeCupboard.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeCupboard = () => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();

  useEffect(() => {
    if (!account?.cupboardID) {
      return;
    }

    console.log(`🔄 Fetching Cupboard data from Firestore`);
    const cupboardRef = doc(db, 'cupboards', account.cupboardID);

    const unsubscribe = onSnapshot(
      cupboardRef,
      snapshot => {
        if (snapshot.exists) {
          const cupboardData = snapshot.data();
          const cupboard = {
            ...cupboardData,
            items: cupboardData.items || [],
            lastUpdated: cupboardData?.lastUpdated || null, // ✅ No more toDate()
          };

          dispatch({type: 'SET_CUPBOARD', payload: cupboard});
        } else {
          dispatch({type: 'SET_CUPBOARD', payload: null});
        }
      },
      error => {
        dispatch({type: 'CUPBOARD_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.cupboardID, db]); // ✅ Removed `persistedCupboard`
};

export default useRealTimeCupboard;
