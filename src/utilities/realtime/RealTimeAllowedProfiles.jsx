//* RealTimeAllowedProfiles.jsx
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {useAccount} from '../../hooks/useHooks';

const useRealTimeAllowedProfiles = () => {
  const dispatch = useDispatch();
  const account = useAccount();
  const db = getFirestore();

  useEffect(() => {
    if (!account?.allowedUsers?.length) {
      return;
    }

    console.log(`🔄 Fetching Allowed Profiles data from Firestore`);

    const profilesQuery = query(
      collection(db, 'profiles'),
      where('id', 'in', account.allowedUsers),
    );

    const unsubscribe = onSnapshot(
      profilesQuery,
      querySnapshot => {
        if (!querySnapshot.empty) {
          const profiles = querySnapshot.docs
            .map(doc => doc.data())
            .filter(profile => profile?.isActive)
            .sort((a, b) => (a.role === 'owner' ? -1 : 1));

          dispatch({type: 'SET_ALLOWED_PROFILES', payload: profiles});
        } else {
          dispatch({type: 'SET_ALLOWED_PROFILES', payload: []});
        }
      },
      error => {
        dispatch({
          type: 'ALLOWED_PROFILES_FETCH_FAILED',
          payload: error.message,
        });
      },
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, account?.allowedUsers, db]); // ✅ Removed `persistedProfiles`
};

export default useRealTimeAllowedProfiles;
