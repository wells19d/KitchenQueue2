import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeFavorites = enabled => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();
  const prevFavoritesRef = useRef(null);

  useEffect(() => {
    if (!enabled || !account?.favoriteItemsID) return;

    const favoritesRef = doc(db, 'favoriteItems', account.favoriteItemsID);

    const unsubscribe = onSnapshot(
      favoritesRef,
      snapshot => {
        if (!snapshot.exists) return;

        const favoritesData = snapshot.data();
        const nextFavorites = {
          ...favoritesData,
          items: Array.isArray(favoritesData.items) ? favoritesData.items : [],
          lastUpdated: favoritesData?.lastUpdated || null,
        };

        const prev = prevFavoritesRef.current;
        const hasChanged =
          JSON.stringify(prev) !== JSON.stringify(nextFavorites);

        if (hasChanged) {
          prevFavoritesRef.current = nextFavorites;
          dispatch({type: 'SET_FAVORITES', payload: nextFavorites});
        }
      },
      error => {
        dispatch({type: 'FAVORITES_SET_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.favoriteItemsID, db, enabled]);
};

export default useRealTimeFavorites;
