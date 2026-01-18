// * RealTimeCupboard.jsx
import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeCupboard = enabled => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();
  const prevCupboardRef = useRef(null);

  useEffect(() => {
    if (!enabled || !account?.cupboardID) return;

    const cupboardRef = doc(db, 'cupboards', account.cupboardID);

    const unsubscribe = onSnapshot(
      cupboardRef,
      snapshot => {
        if (!snapshot.exists) return;

        const cupboardData = snapshot.data();
        const nextCupboard = {
          ...cupboardData,
          items: Array.isArray(cupboardData.items) ? cupboardData.items : [],
          // compare on raw millis (faster, no Date/String allocs)
          lastUpdated: cupboardData?.lastUpdated?.toMillis?.() ?? null,
        };

        const prevUpdatedAt = prevCupboardRef.current?.lastUpdated;
        const nextUpdatedAt = nextCupboard.lastUpdated;

        if (prevUpdatedAt !== nextUpdatedAt) {
          prevCupboardRef.current = nextCupboard;
          dispatch({type: 'SET_CUPBOARD', payload: nextCupboard});
        }
      },
      error => {
        dispatch({type: 'CUPBOARD_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.cupboardID, db, enabled]);
};

export default useRealTimeCupboard;
