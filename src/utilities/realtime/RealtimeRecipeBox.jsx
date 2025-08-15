import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeRecipeBox = enabled => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();
  const prevRecipeBoxRef = useRef(null);
  useEffect(() => {
    if (!enabled || !account?.recipeBoxID) return;

    const recipeBoxRef = doc(db, 'recipeBoxes', account.recipeBoxID);

    const unsubscribe = onSnapshot(
      recipeBoxRef,
      snapshot => {
        if (!snapshot.exists) return;

        const recipeBoxData = snapshot.data();
        const nextRecipeBoxes = {
          ...recipeBoxData,
          items: Array.isArray(recipeBoxData.items) ? recipeBoxData.items : [],
          lastUpdated:
            recipeBoxData?.lastUpdated?.toDate?.().toISOString() ?? null,
        };

        const prev = prevRecipeBoxRef.current;
        const hasChanged =
          JSON.stringify(prev) !== JSON.stringify(nextRecipeBoxes);

        if (hasChanged) {
          prevRecipeBoxRef.current = nextRecipeBoxes;
          dispatch({type: 'SET_RECIPE_BOX', payload: nextRecipeBoxes});
        }
      },
      error => {
        dispatch({type: 'RECIPE_BOX_SET_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.recipeBoxID, db, enabled]);
};

export default useRealTimeRecipeBox;
