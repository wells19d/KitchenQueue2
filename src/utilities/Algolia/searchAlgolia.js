//* searchAlgolia.js
import firestore from '@react-native-firebase/firestore';

export const searchAlgolia = async keywords => {
  if (!keywords || typeof keywords !== 'string' || keywords.trim() === '') {
    return [];
  }

  try {
    const query = encodeURIComponent(keywords);
    const response = await fetch(
      `https://us-central1-kitchen-queue-fe2fe.cloudfunctions.net/searchRecipes?query=${query}`,
    );

    if (!response.ok) {
      console.error('Cloud Function search failed:', await response.text());
      return [];
    }

    const results = await response.json();
    const ids = results.map(r => r.id).filter(Boolean);

    const fullRecipes = [];

    for (let id of ids) {
      const doc = await firestore().collection('community').doc(id).get();
      if (doc.exists) {
        fullRecipes.push({id: doc.id, ...doc.data()});
      }
    }

    return fullRecipes;
  } catch (err) {
    console.error('Error in searchCommunityRecipes:', err);
    return [];
  }
};
