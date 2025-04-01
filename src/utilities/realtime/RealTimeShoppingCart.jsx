//* RealTimeShoppingCart.jsx
import {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeShoppingCart = () => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();
  const prevCartRef = useRef(null);

  useEffect(() => {
    if (!account?.shoppingCartID) return;

    const cartRef = doc(db, 'shoppingCarts', account.shoppingCartID);
    // console.log('🔁 RealTimeShoppingCart listener mounted');

    const unsubscribe = onSnapshot(
      cartRef,
      snapshot => {
        if (!snapshot.exists) return;

        const shopCartData = snapshot.data();
        const nextCart = {
          ...shopCartData,
          items: Array.isArray(shopCartData.items) ? shopCartData.items : [],
          lastUpdated: shopCartData?.lastUpdated || null,
        };

        const prevCart = prevCartRef.current;
        const hasChanged =
          JSON.stringify(prevCart) !== JSON.stringify(nextCart);

        if (hasChanged) {
          // console.log('🟢 RealTimeShoppingCart updated');
          prevCartRef.current = nextCart;
          dispatch({type: 'SET_SHOP_CART', payload: nextCart});
        } else {
          // console.log('⚪ No cart change detected');
        }
      },
      error => {
        // console.error('❌ RealTimeShoppingCart error:', error);
        dispatch({type: 'SHOP_CART_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      // console.log('🛑 RealTimeShoppingCart listener removed');
      unsubscribe();
    };
  }, [dispatch, account?.shoppingCartID, db]);
};

export default useRealTimeShoppingCart;
