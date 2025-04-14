//* RealTimeCupboard.jsx
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
    // console.log('🔁 RealTimeCupboard listener mounted');

    const unsubscribe = onSnapshot(
      cupboardRef,
      snapshot => {
        if (!snapshot.exists) return;

        const cupboardData = snapshot.data();
        const nextCupboard = {
          ...cupboardData,
          items: Array.isArray(cupboardData.items) ? cupboardData.items : [],
          lastUpdated: cupboardData?.lastUpdated || null,
        };

        const prev = prevCupboardRef.current;
        const hasChanged =
          JSON.stringify(prev) !== JSON.stringify(nextCupboard);

        if (hasChanged) {
          // console.log('🟢 RealTimeCupboard updated');
          prevCupboardRef.current = nextCupboard;
          dispatch({type: 'SET_CUPBOARD', payload: nextCupboard});
        } else {
          // console.log('⚪ No cupboard change detected');
        }
      },
      error => {
        // console.error('❌ RealTimeCupboard error:', error);
        dispatch({type: 'CUPBOARD_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      // console.log('🛑 RealTimeCupboard listener removed');
      unsubscribe();
    };
  }, [dispatch, account?.cupboardID, db, enabled]);
};

export default useRealTimeCupboard;
