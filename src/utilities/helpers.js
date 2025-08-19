// helpers.js
import moment from 'moment';
import {displayMeasurements, formatMeasurement} from './measurements';
import pluralize from 'pluralize';

//*helpers.js
export function displayDropField(value, mapData = []) {
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

export function displayDropArray(valueArray, mapData = []) {
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

export const formatMeasurementWithPlural = (packageSize, unit, itemName) => {
  if (packageSize !== undefined && unit !== undefined) {
    if (packageSize === 1 && unit === 'each') {
      return '';
    }

    if (unit === 'each') {
      return `${packageSize} ${pluralize(itemName)}`;
    }

    const match = displayMeasurements.find(m => m.key === unit);

    if (match) {
      const label = match.label;
      return `${packageSize} ${packageSize > 1 ? pluralize(label) : label}`;
    }

    // Custom value fallback
    const formatted = formatMeasurement(unit);
    return `${packageSize} ${
      packageSize > 1 ? pluralize(formatted) : formatted
    }`;
  }

  return '';
};

const UNIT_DISPLAY = {
  oz: 'Ounce',
  g: 'Gram',
  ml: 'mMilliliter',
  kg: 'Kilogram',
  mg: 'Milligram',
  l: 'Liter',
  tsp: 'Teaspoon',
  tbsp: 'Tablespoon',
  'fl oz': 'Fluid Ounce',
};

export const formatMeasurementWithPluralRec = (packageSize, unit, itemName) => {
  if (packageSize !== undefined && unit !== undefined) {
    // special-case "each"
    if (unit === 'each') {
      const name = packageSize > 1 ? pluralize(itemName) : itemName;
      return `${packageSize} ${capEachWord(name)}`;
    }

    // 🔑 check mapping first
    if (UNIT_DISPLAY[unit]) {
      const base = UNIT_DISPLAY[unit];
      const label = packageSize > 1 ? pluralize(base) : base;
      return `${packageSize} ${label} ${capEachWord(itemName)}`;
    }

    // fallback to displayMeasurements
    const match = displayMeasurements.find(m => m.key === unit);
    if (match) {
      const label = packageSize > 1 ? pluralize(match.label) : match.label;
      return `${packageSize} ${label} ${capEachWord(itemName)}`;
    }

    // ultimate fallback
    const formatted = formatMeasurement(unit);
    const label = packageSize > 1 ? pluralize(formatted) : formatted;
    return `${packageSize} ${label} ${capEachWord(itemName)}`;
  }

  return '';
};

const UNIT_REPLACEMENT = {
  oz: 'ounce',
  g: 'gram',
  ml: 'milliliter',
  kg: 'kilogram',
  mg: 'milligram',
  l: 'liter',
  tsp: 'teaspoon',
  tbsp: 'tablespoon',
  'fl oz': 'fluid ounce',
};

export const unitReplacement = unit => {
  if (!unit) return unit;
  const key = unit.toLowerCase().trim();
  return UNIT_REPLACEMENT[key] || unit;
};

// Logger function to handle console output with color coding and time stamps
// Use this function as a normal kqconsole.log using kqconsole.log('message', data);
// Be sure to import it from the helpers file to use this functionality

const makeLogger =
  type =>
  (...args) => {
    if (!__DEV__) return;

    const time = moment().format('HH:mm:ss:SSS');
    const color =
      {
        log: '#63b76C',
        warn: '#E6B800',
        error: '#D32F2F',
        debug: '#009DC4', // Alias for log
      }[type] || '#63b76C';

    const [first, ...rest] = args;
    const prefix = `%c[${time}]`;
    const style = `color: ${color};`;

    if (type === 'table') {
      const dataArgs = typeof first === 'object' && first?.title ? rest : args;

      const validTables = dataArgs.filter(
        item =>
          (Array.isArray(item) && item.length && typeof item[0] === 'object') ||
          (typeof item === 'object' && !Array.isArray(item) && item !== null),
      );

      if (!validTables.length) {
        kqconsole.log(prefix, style, 'Table (invalid data):', ...dataArgs);
      } else {
        validTables.forEach((item, index) => {
          const label = validTables.length > 1 ? `Table ${index + 1}` : 'Table';
          kqconsole.log(prefix, style, `${label}:`);
          console.table(item);
        });
      }

      return;
    } else {
      console[type](prefix, style, `${capEachWord(type)}:`, first, ...rest);
    }
  };

export const kqconsole = (...args) => makeLogger('log')(...args);

kqconsole.log = makeLogger('log');
kqconsole.warn = makeLogger('warn');
kqconsole.error = makeLogger('error');
kqconsole.table = makeLogger('table');
