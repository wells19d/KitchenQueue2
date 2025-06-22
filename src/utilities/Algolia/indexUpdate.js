//* updateIndex.js
import firestore from '@react-native-firebase/firestore';
import {getAlgoliaIndex} from './algoliaClient.native';
import {transformRFA} from './transformRFA';

export const syncAlgoliaWithFirestore = async () => {
  const algoliaIndex = await getAlgoliaIndex();

  return firestore()
    .collection('community')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = change.doc.data();
        const id = change.doc.id;
        const recipe = transformRFA({...data, id});

        if (!recipe) return;

        switch (change.type) {
          case 'added':
          case 'modified':
            algoliaIndex
              .saveObject(recipe)
              .catch(err => console.error('Algolia Save Error:', err));
            break;
          case 'removed':
            algoliaIndex
              .deleteObject(recipe.objectID)
              .catch(err => console.error('Algolia Delete Error:', err));
            break;
        }
      });
    });
};
