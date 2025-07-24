import moment from 'moment';
import {displayMeasurements, formatMeasurement} from './measurements';
import pluralize from 'pluralize';

//*helpers.js
export function displayCustom(value, mapData = []) {
  if (!value || typeof value !== 'string') return null;

  const lowerVal = value.trim().toLowerCase();
  const found = mapData.find(item => item.key === lowerVal);
  if (found) return found;

  const cleaned = lowerVal.replace(/\s+/g, '-');
  const label = cleaned
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    index: -1,
    key: cleaned,
    label,
  };
}

export function displayCustomArray(valueArray, mapData = []) {
  if (!Array.isArray(valueArray)) return [];

  return valueArray
    .map(value => {
      if (!value || typeof value !== 'string') return null;

      const lowerVal = value.trim().toLowerCase();
      const found = mapData.find(item => item.key === lowerVal);
      if (found) return found;

      const cleaned = lowerVal.replace(/\s+/g, '-');
      const label = cleaned
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        index: -1,
        key: cleaned,
        value: cleaned,
        label,
      };
    })
    .filter(Boolean);
}

export const setNumericValue = setter => value => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  setter(cleaned);
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

export const capEachWord = str => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const limitToThreeDecimals = value => {
  if (!value) return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  return num.toFixed(3).replace(/\.?0+$/, ''); // trims trailing zeros
};

export const endWithPeriod = str => {
  if (typeof str !== 'string') return '';
  return str.trim().endsWith('.') ? str.trim() : str.trim() + '.';
};

export const compareByDate = (date1, date2) => {
  if (!date1 || !date2) return false;

  return date1 === date2;
};

export const formatMeasurementWithPlural = (
  packageSize,
  measurement,
  itemName,
) => {
  if (packageSize !== undefined && measurement !== undefined) {
    if (packageSize === 1 && measurement === 'each') {
      return '';
    }

    if (measurement === 'each') {
      return `${packageSize} ${pluralize(itemName)}`;
    }

    const match = displayMeasurements.find(m => m.key === measurement);

    if (match) {
      const label = match.label;
      return `${packageSize} ${packageSize > 1 ? pluralize(label) : label}`;
    }

    // Custom value fallback
    const formatted = formatMeasurement(measurement);
    return `${packageSize} ${
      packageSize > 1 ? pluralize(formatted) : formatted
    }`;
  }

  return '';
};

export const formatMeasurementWithPluralRec = (
  packageSize,
  measurement,
  itemName,
) => {
  if (packageSize !== undefined && measurement !== undefined) {
    if (measurement === 'each') {
      const name = packageSize > 1 ? pluralize(itemName) : itemName;
      return `${packageSize} ${capEachWord(name)}`;
    }

    const match = displayMeasurements.find(m => m.key === measurement);

    if (match) {
      const label = packageSize > 1 ? pluralize(match.label) : match.label;
      return `${packageSize} ${label} ${capEachWord(itemName)}`;
    }

    // Custom value fallback
    const formatted = formatMeasurement(measurement);
    const label = packageSize > 1 ? pluralize(formatted) : formatted;
    return `${packageSize} ${label} ${capEachWord(itemName)}`;
  }

  return '';
};
