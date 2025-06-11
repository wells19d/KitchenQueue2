export const displayCuisineTypes = [
  {index: 0, label: 'All', value: ''},
  {index: 1, label: 'American', value: 'American'},
  {index: 2, label: 'Asian', value: 'Asian'},
  {index: 3, label: 'British', value: 'British'},
  {index: 4, label: 'Caribbean', value: 'Caribbean'},
  {index: 5, label: 'Central Europe', value: 'Central Europe'},
  {index: 6, label: 'Chinese', value: 'Chinese'},
  {index: 7, label: 'Eastern Europe', value: 'Eastern Europe'},
  {index: 8, label: 'French', value: 'French'},
  {index: 9, label: 'Greek', value: 'Greek'},
  {index: 10, label: 'Indian', value: 'Indian'},
  {index: 11, label: 'Italian', value: 'Italian'},
  {index: 12, label: 'Japanese', value: 'Japanese'},
  {index: 13, label: 'Korean', value: 'Korean'},
  {index: 14, label: 'Kosher', value: 'Kosher'},
  {index: 15, label: 'Mediterranean', value: 'Mediterranean'},
  {index: 16, label: 'Mexican', value: 'Mexican'},
  {index: 17, label: 'Middle Eastern', value: 'Middle Eastern'},
  {index: 18, label: 'Nordic', value: 'Nordic'},
  {index: 19, label: 'South American', value: 'South American'},
  {index: 20, label: 'South East Asian', value: 'South East Asian'},
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
