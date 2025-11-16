//* IngredientList.jsx

import React, {useState, useMemo, useEffect} from 'react';
import {useCupboard, useProfile, useShoppingCart} from '../../hooks/useHooks';
import {Modal, Text, Image, View} from '../../KQ-UI';
import {useColors} from '../../KQ-UI/KQUtilities';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDispatch} from 'react-redux';
import {setHapticFeedback} from '../../hooks/setHapticFeedback';
import pluralize from 'pluralize';
import {groupedData, matchConversion} from '../../utilities/conversions';

const IngredientList = ({selectedRecipe}) => {
  const useHaptics = setHapticFeedback();
  const dispatch = useDispatch();
  const profile = useProfile();
  const cupboard = useCupboard();
  const shopping = useShoppingCart();
  const cupboardList = Array.isArray(cupboard?.items) ? cupboard?.items : [];
  const shoppingList = Array.isArray(shopping?.items) ? shopping?.items : [];
  console.log('selectedRecipe', selectedRecipe?.ingredients);
  console.log('cupboardList', cupboardList);
  console.log('shoppingList', shoppingList);

  const cupboardItems = Array.isArray(cupboard?.items) ? cupboard?.items : [];

  const groupedList = useMemo(() => {
    return groupedData(cupboardItems);
  }, [cupboardItems]);

  console.log('groupedList', groupedList);

  const enhancedIngredients = useMemo(() => {
    const cupboardNamesSet = new Set(
      groupedList.map(item => pluralize.singular(item.itemName.toLowerCase())),
    );

    return selectedRecipe?.ingredients?.map(ing => {
      const ingNameLower = ing.name.toLowerCase();
      const ingSingular = pluralize.singular(ingNameLower);

      let matchType = 'noMatch';

      // Ingredient exists in cupboard
      if (cupboardNamesSet.has(ingSingular)) {
        matchType = 'exactMatch';
      } else {
        // Partial match fallback
        for (let itemName of cupboardNamesSet) {
          if (
            itemName.includes(ingSingular) ||
            ingSingular.includes(itemName)
          ) {
            matchType = 'partialMatch';
            break;
          }
        }
      }

      const match = groupedList.find(
        g => pluralize.singular(g.itemName.toLowerCase()) === ingSingular,
      );

      if (!match) {
        return {
          ...ing,
          matchType: 'noMatch',
          hasEnough: false,
        };
      }

      // Convert and check amount
      const enough = matchConversion(
        match.measurement,
        match.remainingAmount,
        ing.unit,
        ing.amount,
      );

      // Now determine match type correctly:
      if (enough) {
        matchType = 'exactMatch';
      } else {
        matchType = 'partialMatch';
      }

      return {
        ...ing,
        matchType,
        hasEnough: enough,
      };
    });
  }, [selectedRecipe, groupedList]);

  console.log('enhancedIngredients', enhancedIngredients);

  return (
    <>
      <></>
    </>
  );
};
export default __DEV__ ? IngredientList : React.memo(IngredientList);

{
  /* {selectedRecipe?.ingredients?.map((ing, index) => (
              <View
                key={index}
                style={{
                  width: `${100 / columns}%`,
                  justifyContent: 'center',
                  paddingVertical: 2,
                  paddingLeft: tablet ? 25 : columns === 1 ? 15 : 7,
                }}>
                <View row>
                  <View style={SelectedRecipeStyles.ingDot}>
                    <Icons.Dot size={4} />
                  </View>
                  <View flex>
                    <Text
                      size="xSmall"
                      font="open-7"
                      numberOfLines={3}
                      onTextLayout={handleTextLayout}>
                      {(() => {
                        if (ing.amount != null) {
                          const pluralUnit = formatPluralUnit(
                            ing.amount,
                            ing.unit,
                          );
                          return `${toFraction(ing.amount)}${
                            pluralUnit ? ` ${pluralUnit}` : ''
                          } `;
                        }
                        return '';
                      })()}
                      {capEachWord(ing.name)}
                    </Text>
                  </View>
                </View>
              </View>
            ))} */
}
