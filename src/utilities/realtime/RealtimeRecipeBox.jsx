// * RealTimeRecipeBox.jsx
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
          createdOn: recipeBoxData?.createdOn?.toDate?.().toISOString() ?? null,
        };

        const prevUpdatedAt = prevRecipeBoxRef.current?.lastUpdated;
        const nextUpdatedAt = nextRecipeBoxes.lastUpdated;

        if (prevUpdatedAt !== nextUpdatedAt) {
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
