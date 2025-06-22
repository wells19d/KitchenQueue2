export const displayDietTypes = [
  {index: 0, label: 'All', value: ''},
  {index: 1, label: 'Gluten Free', value: 'gluten free'},
  {index: 2, label: 'Ketogenic', value: 'ketogenic'},
  {index: 3, label: 'Vegetarian', value: 'vegetarian'},
  {index: 4, label: 'Lacto-Vegetarian', value: 'lacto-vegetarian'},
  {index: 5, label: 'Ovo-Vegetarian', value: 'ovo-vegetarian'},
  {index: 6, label: 'Vegan', value: 'vegan'},
  {index: 7, label: 'Pescetarian', value: 'pescetarian'},
  {index: 8, label: 'Paleo', value: 'paleo'},
  {index: 9, label: 'Primal', value: 'primal'},
  {index: 10, label: 'Low FODMAP', value: 'low FODMAP'},
  {index: 11, label: 'Whole30', value: 'whole30'},
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
