//* transformRFA.js

export const transformRFA = recipe => {
  if (!recipe?.id) return null;

  return {
    objectID: recipe.id, // required by Algolia
    keywords: recipe.keywords || [],
    title: recipe.title || '',
  };
};
