// src/utilities/Algolia/algoliaClient.js
import algoliasearch from 'algoliasearch';
import {fetchRemoteKeys} from '../../firebase.config';

let client = null;

export const getAlgoliaClient = async () => {
  if (client) return client;

  const keys = await fetchRemoteKeys();
  const appID = keys?.algolia?.appID;
  const searchKey = keys?.algolia?.searchKey;

  if (!appID || !searchKey) {
    throw new Error('Algolia keys missing from Remote Config');
  }

  client = algoliasearch(appID, searchKey);
  return client;
};
