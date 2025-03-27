//* RealTimeCupboard.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount, useCupboard} from '../../hooks/useHooks';

const useRealTimeCupboard = () => {
  const dispatch = useDispatch();
  const account = useAccount();
  const persistedCupboard = useCupboard();
  const db = getFirestore();

  useEffect(() => {
    if (!account?.cupboardID) {
      return;
    }

    const cupboardRef = doc(db, 'cupboards', account.cupboardID);
    console.log('RealTimeCupboard fired');

    const unsubscribe = onSnapshot(
      cupboardRef,
      snapshot => {
        if (snapshot.exists) {
          const cupboardData = snapshot.data();
          const cupboard = {
            ...cupboardData,
            items: cupboardData.items || [],
            lastUpdated: cupboardData?.lastUpdated || null,
          };

          if (JSON.stringify(persistedCupboard) !== JSON.stringify(cupboard)) {
            dispatch({type: 'SET_CUPBOARD', payload: cupboard});
          }
        }
      },
      error => {
        dispatch({type: 'CUPBOARD_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.cupboardID, persistedCupboard, db]);
};

export default useRealTimeCupboard;
