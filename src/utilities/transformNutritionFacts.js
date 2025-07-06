import {formatNutrient} from './nutrients';

export const transformNutritionFacts = (food = {}) => {
  if (!food || typeof food !== 'object') return null;

  const {
    foodId,
    label,
    knownAs,
    brand,
    image,
    foodContentsLabel,
    nutrients = {},
    servingSizes = [],
  } = food;

  // 🧠 Inline extractPackageSizeFromLabel
  const extractPackageSizeFromLabel = label => {
    if (!label || typeof label !== 'string') return null;

    const regex = /(\d+(?:\.\d+)?)\s?(fl\s?oz|oz|g|ml|l|count|ct|pk)/i;
    const match = label.match(regex);
    if (!match) return null;

    const quantity = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    let approxMl = null;
    let approxGrams = null;

    if (unit === 'fl oz') approxMl = quantity * 29.5735;
    else if (unit === 'oz') approxGrams = quantity * 28.3495;
    else if (unit === 'ml') approxMl = quantity;
    else if (unit === 'l') approxMl = quantity * 1000;
    else if (unit === 'g') approxGrams = quantity;

    return {
      quantity,
      unit,
      approxMl,
      approxGrams,
      raw: match[0],
    };
  };

  const primaryServing = servingSizes?.[0] || null;
  const servingQty = primaryServing?.quantity || 1;
  const servingLabel = primaryServing?.label?.toLowerCase() || '';
  const servingSizeGrams =
    servingLabel.includes('gram') || servingLabel.includes('g')
      ? servingQty
      : null;

  // Estimate servings per container
  const packageSizeData = extractPackageSizeFromLabel(label);
  let servingsPerContainer = 1;

  if (packageSizeData?.approxMl && servingLabel.includes('fl oz')) {
    const servingMl = servingQty * 29.5735;
    servingsPerContainer = Math.round(packageSizeData.approxMl / servingMl);
  } else if (packageSizeData?.approxGrams && servingSizeGrams) {
    servingsPerContainer = Math.round(
      packageSizeData.approxGrams / servingSizeGrams,
    );
  }

  servingsPerContainer = Math.max(servingsPerContainer, 1);

  // 🧪 Edamam 100g normalization fix
  const assumePer100g =
    servingSizeGrams &&
    servingSizeGrams < 100 &&
    Object.values(nutrients).some(val => val > 30);

  const scaleFactor = assumePer100g ? servingSizeGrams / 100 : 1;

  const perServing = {};
  const perContainer = {};

  Object.entries(nutrients).forEach(([key, val]) => {
    if (!val || val === 0) return;

    const scaled = Math.round(val * scaleFactor);
    if (scaled === 0) return;

    const total = Math.round(scaled * servingsPerContainer);
    const {label: friendlyLabel, unit} = formatNutrient(key);

    perServing[key] = {
      key,
      label: friendlyLabel,
      unit,
      value: scaled,
    };

    perContainer[key] = {
      key,
      label: friendlyLabel,
      unit,
      value: total,
    };
  });

  return {
    foodId,
    itemName: label,
    knownAs,
    brandName: brand,
    image,
    foodContentsLabel,
    servingSizes,
    servingsPerContainer,
    servingSizeLabel: primaryServing?.label || '',
    packageSize: packageSizeData || null,
    nutrients: {
      perServing,
      perContainer,
    },
  };
};
