// firebase.config.js
import {getApp} from '@react-native-firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  setDefaults,
} from '@react-native-firebase/remote-config';

export const fetchEdamamKeys = async () => {
  const app = getApp();
  const config = getRemoteConfig(app);

  await setDefaults(config, {
    EDAMAM_FOOD_ID: '',
    EDAMAM_FOOD_KEY: '',
    EDAMAM_RECIPE_ID: '',
    EDAMAM_RECIPE_KEY: '',
  });

  await fetchAndActivate(config);

  return {
    food: {
      appId: getValue(config, 'EDAMAM_FOOD_ID').asString(),
      appKey: getValue(config, 'EDAMAM_FOOD_KEY').asString(),
    },
    recipe: {
      appId: getValue(config, 'EDAMAM_RECIPE_ID').asString(),
      appKey: getValue(config, 'EDAMAM_RECIPE_KEY').asString(),
    },
  };
};
