import storage from '@react-native-firebase/storage';

export const checkImage = async path => {
  console.log('📦 checkImage got path:', path);
  try {
    const ref = storage().ref(path);
    console.log('📦 got ref, fetching download URL...');
    const url = await ref.getDownloadURL();
    console.log('📦 success, URL:', url);
    return url;
  } catch (error) {
    console.log('📦 checkImage error:', error);
    if (error.code === 'storage/object-not-found') {
      return null;
    }
    throw error;
  }
};

/*

import storage from '@react-native-firebase/storage';
  const deletePicture = async () => {
    try {
      const ref = storage().ref(
        'recipes/wells-creamy-chicken-alfredo-penne-pasta.jpg',
      );

      // First check if it exists by trying to get metadata
      await ref.getMetadata();
      console.log(
        '📂 Found image: wells-creamy-chicken-alfredo-penne-pasta.jpg',
      );

      // If that worked, delete it
      await ref.delete();
      console.log(
        '🗑️ Successfully deleted image: wells-creamy-chicken-alfredo-penne-pasta.jpg',
      );
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        console.error('❌ File not found in storage');
      } else {
        console.error('❌ Failed to delete image:', error);
      }
    }
  };*/
