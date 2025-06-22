export const displayCuisineTypes = [
  {index: 0, label: 'All', value: ''},
  {index: 1, label: 'African', value: 'african'},
  {index: 2, label: 'American', value: 'american'},
  {index: 3, label: 'British', value: 'british'},
  {index: 4, label: 'Cajun', value: 'cajun'},
  {index: 5, label: 'Caribbean', value: 'caribbean'},
  {index: 6, label: 'Chinese', value: 'chinese'},
  {index: 7, label: 'Eastern European', value: 'eastern european'},
  {index: 8, label: 'European', value: 'european'},
  {index: 9, label: 'French', value: 'french'},
  {index: 10, label: 'German', value: 'german'},
  {index: 11, label: 'Greek', value: 'greek'},
  {index: 12, label: 'Indian', value: 'indian'},
  {index: 13, label: 'Irish', value: 'irish'},
  {index: 14, label: 'Italian', value: 'italian'},
  {index: 15, label: 'Japanese', value: 'japanese'},
  {index: 16, label: 'Jewish', value: 'jewish'},
  {index: 17, label: 'Korean', value: 'korean'},
  {index: 18, label: 'Latin American', value: 'latin american'},
  {index: 19, label: 'Mediterranean', value: 'mediterranean'},
  {index: 20, label: 'Mexican', value: 'mexican'},
  {index: 21, label: 'Middle Eastern', value: 'middle eastern'},
  {index: 22, label: 'Nordic', value: 'nordic'},
  {index: 23, label: 'Southern', value: 'southern'},
  {index: 24, label: 'Spanish', value: 'spanish'},
  {index: 25, label: 'Thai', value: 'thai'},
  {index: 26, label: 'Vietnamese', value: 'vietnamese'},
];

export const formatCuisineType = cuisine => {
  if (!cuisine) return 'All';

  const match = displayCuisineTypes.find(c => c.value === cuisine);
  if (match) return match.label;

  return toTitleCase(cuisine);
};

const toTitleCase = str =>
  str
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
