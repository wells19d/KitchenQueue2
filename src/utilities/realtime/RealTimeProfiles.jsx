import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useUser} from '../../hooks/useHooks';

const useRealTimeProfiles = enabled => {
  const dispatch = useDispatch();
  const user = useUser();
  const db = getFirestore();

  useEffect(() => {
    if (!enabled || !user?.uid) {
      return;
    }

    const profileRef = doc(db, 'profiles', user.uid);

    const unsubscribe = onSnapshot(
      profileRef,
      snapshot => {
        if (snapshot.exists) {
          const profileData = snapshot.data();
          const profilePayload = {
            ...profileData,
            lastUpdated:
              profileData?.lastUpdated?.toDate?.().toISOString() ?? null,
            createdOn: profileData?.createdOn?.toDate?.().toISOString() ?? null,
          };
          dispatch({type: 'SET_PROFILE', payload: profilePayload});
        } else {
          dispatch({type: 'SET_PROFILE', payload: null});
        }
      },
      error => {
        dispatch({type: 'PROFILE_FETCH_FAILED', payload: error.message});
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, user?.uid, db, enabled]); // ✅ Removed `storedProfile`
};

export default useRealTimeProfiles;
