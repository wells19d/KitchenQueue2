//* useRecipeIngStatus.js

import {useMemo} from 'react';
import {useCupboard, useShoppingCart} from '../../../hooks/useHooks';
import pluralize from 'pluralize';
import {groupedData, matchConversion} from '../../../utilities/conversions';

export function useRecipeIngStatus(selectedRecipe) {
  const cupboard = useCupboard();
  const shopping = useShoppingCart();

  const cupboardList = Array.isArray(cupboard?.items) ? cupboard.items : [];
  const shoppingList = Array.isArray(shopping?.items) ? shopping.items : [];

  const groupedList = useMemo(() => groupedData(cupboardList), [cupboardList]);

  const ingredientStatus = useMemo(() => {
    if (!selectedRecipe?.ingredients) return [];

    // Sets for name lookups
    const cupboardNames = new Set(
      groupedList.map(i => pluralize.singular(i.itemName.toLowerCase())),
    );

    const shoppingCartNames = new Set(
      shoppingList
        .filter(i => i.status === 'shopping-cart')
        .map(i => pluralize.singular(i.itemName.toLowerCase())),
    );

    const shoppingListNames = new Set(
      shoppingList
        .filter(i => i.status === 'shopping-list')
        .map(i => pluralize.singular(i.itemName.toLowerCase())),
    );

    return selectedRecipe.ingredients.map(ing => {
      const ingSingular = pluralize.singular(ing.name.toLowerCase());
      const isOptional =
        typeof ing.note === 'string' &&
        ing.note.toLowerCase().includes('optional');

      let matchType = cupboardNames.has(ingSingular)
        ? 'exactMatch'
        : 'partialMatch';

      if (!cupboardNames.has(ingSingular)) matchType = 'noMatch';

      const match = groupedList.find(
        g => pluralize.singular(g.itemName.toLowerCase()) === ingSingular,
      );

      if (!match) {
        return {
          ...ing,
          matchType: 'noMatch',
          hasEnough: false,
          inCart: shoppingCartNames.has(ingSingular),
          inList: shoppingListNames.has(ingSingular),
          isOptional,
        };
      }

      const hasEnough = matchConversion(
        match.measurement,
        match.remainingAmount,
        ing.unit,
        ing.amount,
      );

      return {
        ...ing,
        matchType: hasEnough ? 'exactMatch' : 'partialMatch',
        hasEnough,
        inCart: shoppingCartNames.has(ingSingular),
        inList: shoppingListNames.has(ingSingular),
        isOptional,
      };
    });
  }, [selectedRecipe, groupedList, shoppingList]);

  return ingredientStatus;
}
