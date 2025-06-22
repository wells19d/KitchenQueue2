// algolia_search/index.js
// algolia_search/index.js
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

let algoliaClient = null;

exports.searchRecipes = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const algoliaConfig = functions.config().algolia;

    if (!algoliaConfig || !algoliaConfig.app_id || !algoliaConfig.api_key) {
      console.error(
        'Algolia configuration missing! Run: firebase functions:config:set algolia.app_id="..." algolia.api_key="..."',
      );
      return res.status(500).json({
        error: 'Server configuration error: Algolia credentials are not set.',
      });
    }

    const ALGOLIA_APP_ID = algoliaConfig.app_id;
    const ALGOLIA_API_KEY = algoliaConfig.api_key;

    // Initialize Algolia client only once per cold start
    if (!algoliaClient) {
      algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    }
    const index = algoliaClient.initIndex('community_recipes');

    const {query} = req.query;
    if (!query) {
      return res.status(400).json({
        // Changed to .json() and added return
        error:
          'Missing query parameter. Please provide a "query" like /searchRecipes?query=...',
      });
    }

    // Perform the search in Algolia
    const {hits} = await index.search(query, {
      hitsPerPage: 20,
    });

    res.status(200).json(hits); // Changed to .json()
  } catch (error) {
    console.error('Algolia search error:', error);
    return res.status(500).json({
      // Changed to .json() and added return
      error: 'An error occurred during the search. Please try again later.',
    });
  }
});

//firebase deploy --only functions:algolia_search
