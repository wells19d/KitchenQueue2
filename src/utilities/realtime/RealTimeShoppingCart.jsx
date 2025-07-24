//* RealTimeShoppingCart.jsx
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
          lastUpdated:
            shopCartData?.lastUpdated?.toDate?.().toISOString() ?? null,
        };

        const prevCart = prevCartRef.current;
        const hasChanged =
          JSON.stringify(prevCart) !== JSON.stringify(nextCart);

        if (hasChanged) {
          prevCartRef.current = nextCart;
          dispatch({type: 'SET_SHOP_CART', payload: nextCart});
        } else {
          // na
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
