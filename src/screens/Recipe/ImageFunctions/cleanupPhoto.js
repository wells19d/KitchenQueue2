// cleanupPhoto.js
import RNFS from 'react-native-fs';

export const cleanupPhoto = async fileUri => {
  if (!fileUri) return;

  try {
    // Ensure it's a local file path
    const path = fileUri.startsWith('file://')
      ? fileUri.replace('file://', '')
      : fileUri;

    const exists = await RNFS.exists(path);
    if (exists) {
      await RNFS.unlink(path);
      console.log(`Deleted image: ${path}`);
    }
  } catch (err) {
    console.log('Error cleaning up image:', err);
  }
};
