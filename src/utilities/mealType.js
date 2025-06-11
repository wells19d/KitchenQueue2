export const displayMealTypes = [
  {index: 0, label: 'All', value: ''},
  {index: 1, label: 'Breakfast', value: 'Breakfast'},
  {index: 2, label: 'Lunch', value: 'Lunch'},
  {index: 3, label: 'Dinner', value: 'Dinner'},
  {index: 4, label: 'Snack', value: 'Snack'},
];

export const formatMealType = meal => {
  if (!meal) return 'All';

  const match = displayMealTypes.find(m => m.value === meal);
  if (match) return match.label;

  return toTitleCase(meal);
};

const toTitleCase = str =>
  str
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
