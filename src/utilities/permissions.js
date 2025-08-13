//* permissions.js

import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';

export const requestPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  const version = Platform.Version;

  const permissionsToRequest = [];

  // Media permissions (Android 13+)
  if (version >= 33) {
    permissionsToRequest.push(
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    );
  } else {
    // Legacy media access
    permissionsToRequest.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  }

  // Camera (all Android versions)
  permissionsToRequest.push(PERMISSIONS.ANDROID.CAMERA);

  try {
    const statuses = await requestMultiple(permissionsToRequest);

    let allGranted = true;
    for (const key in statuses) {
      if (statuses[key] !== RESULTS.GRANTED) {
        allGranted = false;
        console.log(`❌ ${key}: ${statuses[key]}`);
      } else {
        console.log(`✅ ${key}: granted`);
      }
    }

    return allGranted;
  } catch (err) {
    console.error('Error requesting permissions:', err);
    return false;
  }
};
