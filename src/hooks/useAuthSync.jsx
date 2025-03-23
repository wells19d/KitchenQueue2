//* useAuthSync
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';

const useAuthSync = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        dispatch({type: 'SET_USER', payload: firebaseUser});
      } else {
        dispatch({type: 'LOGOUT'});
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuthSync;
