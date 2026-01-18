// * RealTimeShoppingCart.jsx
import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeShoppingCart = enabled => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();
  const prevCartRef = useRef(null);

  useEffect(() => {
    if (!enabled || !account?.shoppingCartID) return;

    const cartRef = doc(db, 'shoppingCarts', account.shoppingCartID);

    const unsubscribe = onSnapshot(
      cartRef,
      snapshot => {
        if (!snapshot.exists) return;

        const shopCartData = snapshot.data();
        const nextCart = {
          ...shopCartData,
          items: Array.isArray(shopCartData.items) ? shopCartData.items : [],
          // compare using raw millis (fewer allocations)
          lastUpdated: shopCartData?.lastUpdated?.toMillis?.() ?? null,
        };

        const prevUpdatedAt = prevCartRef.current?.lastUpdated;
        const nextUpdatedAt = nextCart.lastUpdated;

        if (prevUpdatedAt !== nextUpdatedAt) {
          prevCartRef.current = nextCart;
          dispatch({type: 'SET_SHOP_CART', payload: nextCart});
        }
      },
      error => {
        dispatch({type: 'SHOP_CART_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.shoppingCartID, db, enabled]);
};

export default useRealTimeShoppingCart;
