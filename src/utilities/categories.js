//* categories.js

export const displayCategories = [
  {index: 0, key: 'na', label: 'No Category', bg: '#319177'},
  {index: 1, key: 'meats-seafood', label: 'Meat & Seafood', bg: '#8B0000'},
  {index: 2, key: 'dairy', label: 'Dairy & Eggs', bg: '#FFB300'},
  {index: 3, key: 'produce', label: 'Produce', bg: '#2E8B57'},
  {index: 4, key: 'frozen', label: 'Frozen Goods', bg: '#4682B4'},
  {index: 5, key: 'baked', label: 'Baked Goods', bg: '#C5A27D'},
  {index: 6, key: 'dry-pasta', label: 'Dry Goods & Pasta', bg: '#C5A27D'},
  {index: 7, key: 'condiments', label: 'Condiments & Sauces', bg: '#A0522D'},
  {index: 8, key: 'canned', label: 'Canned Goods', bg: '#708090'},
  {index: 9, key: 'spices', label: 'Oils, Vinegars & Spices', bg: '#DAA520'},
  {index: 10, key: 'baking', label: 'Baking Ingredients', bg: '#C5A27D'},
  {index: 11, key: 'cereals', label: 'Breakfast & Cereal', bg: '#CD853F'},
  {index: 12, key: 'snacks', label: 'Snacks & Candy', bg: '#FF6347'},
  {index: 13, key: 'beverages', label: 'Beverages', bg: '#4682B4'},
  {index: 14, key: 'other', label: 'Other', bg: '#319177'},
  {index: 99, key: 'custom', label: 'Custom (Enter Your Own)', bg: '#319177'},
];

export const formatCategories = category => {
  if (!category) return '';

  // Replace dashes with spaces
  const cleaned = category.replace(/-/g, ' ');

  // Capitalize each word
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const categoryColors = category => {
  const found = displayCategories.find(cat => cat.key === category);

  if (category === undefined || category === null) {
    return '#319177';
  } else if (found) {
    return found.bg;
  } else {
    return '#319177';
  }
};
