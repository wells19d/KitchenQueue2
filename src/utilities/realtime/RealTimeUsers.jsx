//* RealTimeUsers.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getAuth, onAuthStateChanged} from '@react-native-firebase/auth';

const auth = getAuth();

const useRealTimeUsers = enabled => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        dispatch({type: 'SET_USER', payload: currentUser});
      } else {
        dispatch({type: 'UNSET_USER'});
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, enabled]);
};

export default useRealTimeUsers;
