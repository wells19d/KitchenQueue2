// firebase.config.js
import {getApp} from '@react-native-firebase/app';
import {
  getRemoteConfig,
  getValue,
  setDefaults,
} from '@react-native-firebase/remote-config';

export const fetchRemoteKeys = async () => {
  const app = getApp();
  const config = getRemoteConfig(app);

  await setDefaults(config, {
    EDAMAM_FOOD_ID: '',
    EDAMAM_FOOD_KEY: '',
    ALGOLIA_APP_ID: '',
    ALGOLIA_APP_SEARCH_KEY: '',
    ALGOLIA_APP_WRITE_KEY: '',
    ALGOLIA_API_MONITORING_KEY: '',
    ALGOLIA_API_USAGE_KEY: '',
    ALGOLIA_APP_ADMIN_KEY: '',
    UPC_API_KEY: '',
  });

  await config.fetch(0);
  await config.activate();

  return {
    food: {
      appId: getValue(config, 'EDAMAM_FOOD_ID').asString(),
      appKey: getValue(config, 'EDAMAM_FOOD_KEY').asString(),
    },
    algolia: {
      appID: getValue(config, 'ALGOLIA_APP_ID').asString(),
      searchKey: getValue(config, 'ALGOLIA_APP_SEARCH_KEY').asString(),
      writeKey: getValue(config, 'ALGOLIA_APP_WRITE_KEY').asString(),
      monitorKey: getValue(config, 'ALGOLIA_API_MONITORING_KEY').asString(),
      usagekey: getValue(config, 'ALGOLIA_API_USAGE_KEY').asString(),
      adminKey: getValue(config, 'ALGOLIA_APP_ADMIN_KEY').asString(),
    },
    upc: {
      apiKey: getValue(config, 'UPC_API_KEY').asString(), // 👈 added here
    },
  };
};
