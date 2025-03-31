//* measurements.js

export const displayMeasurements = [
  {index: 0, key: 'each', label: 'Single (Each)'},
  {index: 1, key: 'slice', label: 'Slice'},
  {index: 2, key: 'bag', label: 'Bag'},
  {index: 3, key: 'roll', label: 'Roll'},
  {index: 4, key: 'tube', label: 'Tube'},
  {index: 5, key: 'package', label: 'Package'},
  {index: 6, key: 'box', label: 'Box'},
  {index: 7, key: 'fluidounce', label: 'Fluid Ounce'},
  {index: 8, key: 'milliliter', label: 'Milliliter'},
  {index: 9, key: 'liter', label: 'Liter'},
  {index: 10, key: 'pint', label: 'Pint'},
  {index: 11, key: 'quart', label: 'Quart'},
  {index: 12, key: 'gallon', label: 'Gallon'},
  {index: 13, key: 'ounce', label: 'Ounce'},
  {index: 14, key: 'pound', label: 'Pound'},
  {index: 15, key: 'gram', label: 'Gram'},
  {index: 16, key: 'kilogram', label: 'Kilogram'},
  {index: 17, key: 'can', label: 'Can'},
  {index: 18, key: 'cup', label: 'Cup'},
  {index: 19, key: 'tablespoon', label: 'Tablespoon'},
  {index: 20, key: 'teaspoon', label: 'Teaspoon'},
  {index: 99, key: 'custom', label: 'Custom (Enter Your Own)'},
];

export const formatMeasurement = measurement => {
  if (!measurement) return '';

  // Replace dashes with spaces
  const cleaned = measurement.replace(/-/g, ' ');

  // Capitalize each word
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
