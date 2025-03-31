//*helpers.js
export function displayCustom(value, mapData = []) {
  if (!value || typeof value !== 'string') return null;

  const found = mapData.find(item => item.key === value.toLowerCase());
  if (found) return found;

  const cleaned = value.trim().toLowerCase().replace(/\s+/g, '-');
  const label = cleaned
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    index: -1,
    key: cleaned,
    label: label,
  };
}

export const setNumericValue = setter => value => {
  if (value === '' || /^[0-9]*$/.test(value)) {
    setter(value); //
  }
};

export const titleCase = str => {
  if (!str) return ''; // Handle null or undefined inputs gracefully

  return str
    .toLowerCase() // Convert the entire string to lowercase first
    .split(' ') // Split the string into words
    .map(word => {
      // Capitalize the first letter and preserve the rest
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' '); // Rejoin the words into a single string
};

export const capFirst = str => {
  if (!str) return ''; // Handle null or undefined inputs gracefully

  const lowerCaseStr = str.toLowerCase(); // Convert entire string to lowercase
  return lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
};
