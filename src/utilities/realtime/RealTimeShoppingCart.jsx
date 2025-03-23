//* RealTimeShoppingCart.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useAccount, useShoppingCart} from '../../hooks/useHooks';

const useRealTimeShoppingCart = () => {
  const dispatch = useDispatch();
  const account = useAccount();
  const persistedCart = useShoppingCart();
  const db = getFirestore();

  useEffect(() => {
    if (!account?.shoppingCartID) {
      return;
    }

    const cartRef = doc(db, 'shoppingCarts', account.shoppingCartID);
    console.log('RealTimeShoppingCart fired');

    const unsubscribe = onSnapshot(
      cartRef,
      snapshot => {
        if (snapshot.exists) {
          const shopCartData = snapshot.data();
          const shopCart = {
            ...shopCartData,
            items: shopCartData.items || [],
            lastUpdated: shopCartData?.lastUpdated || null, // ✅ No need for toDate()
          };

          // ✅ Prevent unnecessary updates by checking if data changed
          if (JSON.stringify(persistedCart) !== JSON.stringify(shopCart)) {
            dispatch({type: 'SET_SHOP_CART', payload: shopCart});
          }
        }
      },
      error => {
        dispatch({type: 'SHOP_CART_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.shoppingCartID, persistedCart, db]);
};

export default useRealTimeShoppingCart;
