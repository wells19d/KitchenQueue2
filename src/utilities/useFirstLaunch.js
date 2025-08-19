// * useFirstLaunch.js

// src/utilities/useFirstLaunch.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState, useCallback} from 'react';

const KEY = 'KQ_FIRST_OPEN_SEEN_V1';

export function useFirstLaunch() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  const markSeen = useCallback(async () => {
    await AsyncStorage.setItem(KEY, 'true');
    setIsFirstLaunch(false);
  }, []);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(KEY);
      setIsFirstLaunch(v !== 'true'); // true on fresh install
    })();
  }, []);

  return {isFirstLaunch, markSeen};
}
