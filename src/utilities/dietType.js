//* dietType.js
export const displayDietTypes = [
  {key: 'diet-header-general', label: 'General Diets', isHeader: true},
  {index: 0, key: 'low-carb', label: 'Low Carb'},
  {index: 1, key: 'low-fat', label: 'Low Fat'},
  {index: 2, key: 'high-protein', label: 'High Protein'},
  {index: 3, key: 'low-sugar', label: 'Low Sugar'},

  {
    key: 'diet-header-lifestyle',
    label: 'Lifestyle & Philosophical',
    isHeader: true,
  },
  {index: 4, key: 'vegetarian', label: 'Vegetarian'},
  {index: 5, key: 'lacto-vegetarian', label: 'Lacto-Vegetarian'},
  {index: 6, key: 'ovo-vegetarian', label: 'Ovo-Vegetarian'},
  {index: 7, key: 'vegan', label: 'Vegan'},
  {index: 8, key: 'pescetarian', label: 'Pescetarian'},
  {index: 9, key: 'flexitarian', label: 'Flexitarian'},
  {index: 10, key: 'raw', label: 'Raw'},
  {index: 11, key: 'whole30', label: 'Whole30'},

  {
    key: 'diet-header-medical',
    label: 'Medical / Allergen Related',
    isHeader: true,
  },
  {index: 12, key: 'gluten-free', label: 'Gluten Free'},
  {index: 13, key: 'dairy-free', label: 'Dairy Free'},
  {index: 14, key: 'nut-free', label: 'Nut Free'},
  {index: 15, key: 'soy-free', label: 'Soy Free'},
  {index: 16, key: 'egg-free', label: 'Egg Free'},
  {index: 17, key: 'low-sodium', label: 'Low Sodium'},
  {index: 18, key: 'low-fodmap', label: 'Low FODMAP'},

  {key: 'diet-header-weight', label: 'Weight & Metabolic', isHeader: true},
  {index: 19, key: 'ketogenic', label: 'Ketogenic (Keto)'},
  {index: 20, key: 'paleo', label: 'Paleo'},
  {index: 21, key: 'atkins', label: 'Atkins'},
  {index: 22, key: 'mediterranean', label: 'Mediterranean'},
  {index: 23, key: 'dash', label: 'DASH'},
  {index: 24, key: 'diabetic', label: 'Diabetic Friendly'},

  {key: 'diet-header-cultural', label: 'Cultural / Religious', isHeader: true},
  {index: 25, key: 'halal', label: 'Halal'},
  {index: 26, key: 'kosher', label: 'Kosher'},
];

export const formatDietType = diet => {
  if (!diet) return 'All';

  const match = displayDietTypes.find(d => d.value === diet);
  if (match) return match.label;

  return toTitleCase(diet);
};

const toTitleCase = str =>
  str
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
