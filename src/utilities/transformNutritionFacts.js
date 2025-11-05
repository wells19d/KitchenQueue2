// transformNutritionFacts.js
import {formatNutrient} from './nutrients';

/* -------------------------------------------
 * Unit normalization → your displayMeasurements keys
 * ------------------------------------------- */
const UNIT_ALIASES = {
  // volume
  fluidounce: [
    'fl oz',
    'fl. oz',
    'fl-oz',
    'floz',
    'fluid oz',
    'fluid ounce',
    'fluidounces',
    'flounce',
  ],
  milliliter: ['ml', 'milliliter', 'milliliters', 'millilitre', 'millilitres'],
  liter: ['l', 'lt', 'liter', 'liters', 'litre', 'litres'],
  cup: ['cup', 'cups'],
  pint: ['pint', 'pints', 'pt'],
  quart: ['quart', 'quarts', 'qt'],
  gallon: ['gallon', 'gallons', 'gal'],
  tablespoon: ['tbsp', 'tbs', 'tablespoon', 'tablespoons'],
  teaspoon: ['tsp', 'teaspoon', 'teaspoons'],

  // weight
  ounce: ['oz', 'ounce', 'ounces'],
  gram: ['g', 'gr', 'gram', 'grams'],
  kilogram: ['kg', 'kilogram', 'kilograms'],
  pound: ['lb', 'lbs', 'pound', 'pounds'],

  // count / package / forms
  each: ['ea', 'each', 'ct', 'count', 'single', 'unit'],
  pack: ['pack', 'pk'],
  package: ['package', 'pkg'],
  bag: ['bag', 'bags'],
  bottle: ['bottle', 'bottles'],
  box: ['box', 'boxes'],
  jar: ['jar', 'jars'],
  can: ['can', 'cans'],
  bar: ['bar', 'bars'],
};

const ALIAS_TO_KEY = (() => {
  const map = new Map();
  for (const [key, aliases] of Object.entries(UNIT_ALIASES)) {
    aliases.forEach(a => map.set(a.toLowerCase(), key));
  }
  return map;
})();

const normalizeUnit = rawUnit => {
  if (!rawUnit) return null;
  const cleaned = String(rawUnit)
    .trim()
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');

  if (ALIAS_TO_KEY.has(cleaned)) return ALIAS_TO_KEY.get(cleaned);

  const squashed = cleaned.replace(/\s{2,}/g, ' ');
  if (ALIAS_TO_KEY.has(squashed)) return ALIAS_TO_KEY.get(squashed);

  if (UNIT_ALIASES[cleaned]) return cleaned;

  // Unknown: return cleaned to allow downstream handling (or swap to `null` to hard-fail)
  return cleaned;
};

/* -------------------------------------------
 * Size parsing from free text
 * Priority: Stores[].title → item_attributes.title → fatsecret.food_name
 * ------------------------------------------- */
function parseSizeFromText(text = '') {
  if (!text || typeof text !== 'string') return null;
  const t = text.trim();

  // 1) fractions like "1/2 gallon" or "½ gallon"
  const fracMatch = t.match(
    /(?:1\/2|½)\s*(gallon|gal|quart|qt|pint|pt|cup|fl\s?oz|fluid\s?ounce|liter|litre|l)/i,
  );
  if (fracMatch) {
    const rawUnit = fracMatch[1];
    const unit = normalizeUnit(rawUnit);
    return {packageSize: '0.5', measurement: unit};
  }

  // 2) dozen / single
  if (/\bdozen\b/i.test(t)) return {packageSize: '12', measurement: 'each'};
  if (/\bsingle\b/i.test(t)) return {packageSize: '1', measurement: 'each'};

  // 3) generic count: "6 ct", "6 count", "6 each", "2 pack"
  const countMatch = t.match(/\b(\d+(?:\.\d+)?)\s*(ct|count|each|pack|pk)\b/i);
  if (countMatch) {
    const qty = countMatch[1];
    const unit = normalizeUnit(countMatch[2]);
    return {packageSize: String(qty), measurement: unit};
  }

  // 4) number + unit combos: "15 oz", "15oz", "32-oz", "1 L"
  const numUnitMatch = t.match(
    /\b(\d+(?:\.\d+)?)\s*(?:-| )?(fl\s?oz|fluid\s?ounce|oz|ounce|ounces|lb|lbs|pound|g|gr|gram|grams|kg|kilogram|ml|milliliter|millilitre|l|liter|litre|pint|pt|quart|qt|gallon|gal|cup|tbsp|tbs|tablespoon|tsp|teaspoon)\b/i,
  );
  if (numUnitMatch) {
    const qty = numUnitMatch[1];
    const unit = normalizeUnit(numUnitMatch[2]);
    return {packageSize: String(qty), measurement: unit};
  }

  // 5) naked unit without number → assume 1 (e.g., "Gallon Milk")
  const unitOnlyMatch = t.match(
    /\b(fl\s?oz|fluid\s?ounce|oz|ounce|ounces|lb|lbs|pound|g|gr|gram|grams|kg|kilogram|ml|milliliter|millilitre|l|liter|litre|pint|pt|quart|qt|gallon|gal|cup|tbsp|tbs|tablespoon|tsp|teaspoon|ct|count|each|pack|pk|bottle|jar|can|box|bag|bar)\b/i,
  );
  if (unitOnlyMatch) {
    const unit = normalizeUnit(unitOnlyMatch[1]);
    return {packageSize: '1', measurement: unit};
  }

  return null;
}

function defaultEach() {
  return {packageSize: '1', measurement: 'each'};
}

/* -------------------------------------------
 * Main transform
 * ------------------------------------------- */
export const transformNutritionFacts = (merged = {}) => {
  if (!merged || typeof merged !== 'object') return null;

  const fat = merged?.fatsecret?.food || {};
  const spider = merged?.barcodeSpider || {};

  // --- 1) IDs & branding ---
  const foodID = fat.food_id || null;
  const itemName = fat.food_name || spider?.item_attributes?.title || null;
  const brandName = fat.brand_name || spider?.item_attributes?.brand || null;
  const upc = spider?.item_attributes?.upc || null;
  const ean = spider?.item_attributes?.ean || null;
  const foodURL = fat.food_url || null;

  // --- 2) Package size & measurement (Stores → item_attributes → fatsecret → default) ---
  let sizeResult = null;

  if (Array.isArray(spider?.Stores)) {
    for (const s of spider.Stores) {
      sizeResult = parseSizeFromText(s?.title);
      if (sizeResult) break;
    }
  }
  if (!sizeResult)
    sizeResult = parseSizeFromText(spider?.item_attributes?.title);
  if (!sizeResult) sizeResult = parseSizeFromText(fat?.food_name);
  if (!sizeResult) sizeResult = defaultEach();

  const packageSize = sizeResult.packageSize; // strings per your schema
  const measurement = sizeResult.measurement; // normalized to displayMeasurements keys

  // --- 3) Images: Stores first (Amazon etc.), then item_attributes.image ---
  const images = [];
  if (Array.isArray(spider?.Stores)) {
    spider.Stores.forEach(store => {
      if (store.image && !images.includes(store.image))
        images.push(store.image);
    });
  }
  if (
    spider?.item_attributes?.image &&
    !images.includes(spider.item_attributes.image)
  ) {
    images.push(spider.item_attributes.image);
  }

  // --- 4) Serving (first) from FatSecret (if present) ---
  const serving =
    fat?.servings?.serving && Array.isArray(fat.servings.serving)
      ? fat.servings.serving[0]
      : fat?.servings?.serving || null;

  // --- 5) Nutrients (FatSecret set) ---
  const nutrientKeys = [
    'calories',
    'carbohydrate',
    'protein',
    'fat',
    'saturated_fat',
    'polyunsaturated_fat',
    'monounsaturated_fat',
    'trans_fat',
    'cholesterol',
    'sodium',
    'potassium',
    'fiber',
    'sugar',
    'added_sugars',
    'vitamin_a',
    'vitamin_c',
    'vitamin_d',
    'calcium',
    'iron',
  ];

  const perServing = {};
  if (serving) {
    nutrientKeys.forEach(key => {
      const raw = serving[key];
      if (raw === undefined || raw === null) return;
      const val = parseFloat(raw);
      if (isNaN(val) || val === 0) return;

      const {label, unit} = formatNutrient(key);
      perServing[key] = {key, label, unit, value: val};
    });
  }

  // For now perContainer mirrors perServing; later you can scale by servings per container.
  const perContainer = {...perServing};

  // --- 6) Compose final object ---
  return {
    foodID,
    ean,
    upc,
    itemName,
    brandName,
    packageSize,
    measurement,
    images,
    servings: {
      serving: serving
        ? [
            {
              serving_id: serving.serving_id,
              serving_description: serving.serving_description,
              serving_url: serving.serving_url,
              metric_serving_amount: serving.metric_serving_amount,
              metric_serving_unit: serving.metric_serving_unit,
              number_of_units: serving.number_of_units,
              measurement_description: serving.measurement_description,
              ...perServing,
            },
          ]
        : [],
    },
    nutrients: {
      perServing,
      perContainer,
    },
    foodURL,
  };
};
