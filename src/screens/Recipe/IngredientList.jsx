//* IngredientList.jsx

import React, {useState, useMemo, useEffect} from 'react';
import {useCupboard, useShoppingCart} from '../../hooks/useHooks';
import {Button, Text, View} from '../../KQ-UI';
import {useColors} from '../../KQ-UI/KQUtilities';
import {useCoreInfo} from '../../utilities/coreInfo';
import {useDispatch} from 'react-redux';
import pluralize from 'pluralize';
import {groupedData, matchConversion} from '../../utilities/conversions';
import {capEachWord, getIndicator, titleCase} from '../../utilities/helpers';
import {formatPluralUnit} from '../../utilities/formatPluralUnit';
import {toFraction} from '../../utilities/fractionUnit';
import {Icons} from '../../components/IconListRouter';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {renderIcon, renderSubInfo} from './listHelpers';

const IngredientList = ({selectedRecipe, showWDIH, WDIHToggle, onClose}) => {
  const dispatch = useDispatch();
  const core = useCoreInfo();
  const cupboard = useCupboard();
  const shopping = useShoppingCart();
  const useColor = useColors;

  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [recentlyAddedAll, setRecentlyAddedAll] = useState(false);

  useEffect(() => {
    if (onClose) {
      return () => {
        setRecentlyAdded({});
        setRecentlyAddedAll(false);
      };
    }
  }, [onClose]);

  const cupboardList = Array.isArray(cupboard?.items) ? cupboard.items : [];
  const shoppingList = Array.isArray(shopping?.items) ? shopping.items : [];

  const groupedList = useMemo(() => groupedData(cupboardList), [cupboardList]);

  const enhancedIngredients = useMemo(() => {
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

    return selectedRecipe?.ingredients?.map(ing => {
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

      const enough = matchConversion(
        match.measurement,
        match.remainingAmount,
        ing.unit,
        ing.amount,
      );

      return {
        ...ing,
        matchType: enough ? 'exactMatch' : 'partialMatch',
        hasEnough: enough,
        inCart: shoppingCartNames.has(ingSingular),
        inList: shoppingListNames.has(ingSingular),
        isOptional,
      };
    });
  }, [selectedRecipe, groupedList, shoppingList]);

  const AddItem = ing => {
    const ingSingular = pluralize.singular(ing.name.toLowerCase());

    const existing = shoppingList.find(item => {
      const itemSing = pluralize.singular(item.itemName.toLowerCase());
      return (
        item.status === 'shopping-list' &&
        itemSing === ingSingular &&
        item.measurement === ing.unit &&
        Number(item.packageSize) === Number(ing.amount)
      );
    });

    if (existing) {
      const updatedItem = {
        ...existing,
        quantity: Number(existing.quantity) + 1,
      };

      dispatch({
        type: 'UPDATE_ITEM_IN_SHOP_CART',
        payload: {
          shoppingCartID: core.shoppingCartID,
          updatedItem,
          updateType: 'updateList',
          profileID: core.profileID,
        },
      });
    } else {
      const newItem = {
        itemName: titleCase(ing.name),
        brandName: '',
        description: '',
        packageSize: ing.amount,
        quantity: 1,
        measurement: ing.unit,
        category: 'na',
        notes: '',
        status: 'shopping-list',
      };

      dispatch({
        type: 'ADD_ITEM_TO_SHOP_CART',
        payload: {
          shoppingCartID: core.shoppingCartID,
          newItem,
          profileID: core.profileID,
        },
      });
    }

    setRecentlyAdded(prev => {
      const updated = {...prev, [ing.name]: true};
      const allAdded = enhancedIngredients.every(ing => updated[ing.name]);
      if (allAdded) setRecentlyAddedAll(true);
      return updated;
    });
  };

  const AddAllItems = () => {
    let itemsToAdd = [];
    let itemsToUpdate = [];

    enhancedIngredients.forEach(ing => {
      if (!ing.inCart && !ing.inList) {
        itemsToAdd.push(ing);
      } else if (ing.inCart || ing.inList) {
        itemsToUpdate.push(ing);
      }
    });

    dispatch({
      type: 'ADD_ALL_ITEMS_TO_SHOP_CART',
      payload: {
        itemsToAdd,
        itemsToUpdate,
        shoppingCartID: core.shoppingCartID,
        profileID: core.profileID,
      },
    });

    const all = {};
    enhancedIngredients.forEach(ing => {
      all[ing.name] = true;
    });

    setRecentlyAdded(all);
    setRecentlyAddedAll(true);
  };

  const ItemAdd = ({ing}) => {
    const isAdded = !!recentlyAdded[ing.name];
    const success = useColor('success');

    const style = [
      styles.addButton,
      isAdded && {borderWidth: 2, borderColor: success},
    ];

    return (
      <View centerVH pr5 pl10>
        <Button
          type="outline"
          color={isAdded ? 'Success' : 'Dark'}
          disabled={isAdded}
          disabledColor="Success"
          onPress={() => AddItem(ing)}
          style={style}>
          <View row centerVH pr={5}>
            {isAdded ? (
              <Icons.Check color={success} size={15} />
            ) : (
              <Icons.Plus />
            )}
            <Text size="xSmall">{isAdded ? ' Added' : 'Add'}</Text>
          </View>
        </Button>
      </View>
    );
  };

  if (showWDIH) {
    const success = useColor('success');
    const style = [
      styles.addButton,
      recentlyAddedAll && {borderWidth: 2, borderColor: success},
    ];

    return (
      <View flex>
        <View row>
          {showWDIH && (
            <View flex pv={5}>
              <Button
                color="orange"
                style={styles.backButton}
                onPress={WDIHToggle}
                textSize="xSmall">
                Back to Recipe
              </Button>
            </View>
          )}
          <View flex pv={5}>
            <Button
              type="outline"
              color={recentlyAddedAll ? 'Success' : 'Dark'}
              disabled={recentlyAddedAll}
              disabledColor="Success"
              onPress={AddAllItems}
              style={style}>
              <View row pr={5} centerVH>
                {recentlyAddedAll ? (
                  <Icons.Check color={success} size={15} />
                ) : (
                  <Icons.Plus size={15} />
                )}
                <Text size="xSmall">
                  {recentlyAddedAll ? ' Added All' : ' Add All Ingredients'}
                </Text>
              </View>
            </Button>
          </View>
        </View>
        <View flex borderTopWidth={0.25} pb={15}>
          {enhancedIngredients?.map((ing, i) => {
            const indicator = getIndicator(ing);
            const amt = ing.amount ? toFraction(ing.amount) : '';
            const unit = formatPluralUnit(ing.amount, ing.unit);
            return (
              <View key={i} row borderBottomWidth={0.25} style={{height: 60}}>
                <View centerVH>{renderIcon(indicator)}</View>
                <View flex centerV>
                  <Text size="small" font="open-7" numberOfLines={3}>
                    {amt && unit ? `${amt} ${unit} ` : amt ? `${amt} ` : ''}
                    {capEachWord(ing.name)}
                  </Text>
                  <Text size="tiny" italic>
                    {renderSubInfo(indicator, ing)}
                  </Text>
                </View>
                <ItemAdd ing={ing} />
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View flex>
      <View flex ph5>
        {enhancedIngredients?.map((ing, i) => (
          <View key={i} row centerVH pv={2}>
            <View ml10 mr5>
              <Icons.Dot size={7} />
            </View>

            <View ml5 flex>
              <Text size="xSmall" font="open-7" numberOfLines={3}>
                {ing.amount
                  ? `${toFraction(ing.amount)} ${
                      formatPluralUnit(ing.amount, ing.unit) || ''
                    } `
                  : ''}
                {capEachWord(ing.name)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View centerVH mt10 mb5>
        <Button
          type="outline"
          style={styles.widin}
          onPress={WDIHToggle}
          textSize="xSmall">
          What Ingredients Do I Have / Need?
        </Button>
      </View>
    </View>
  );
};

export default __DEV__ ? IngredientList : React.memo(IngredientList);

const styles = StyleSheet.create({
  addButton: {
    borderWidth: 1.25,
    borderRadius: 10,
    height: 35,
  },
  backButton: {borderRadius: 10, height: 35},
  widin: {borderWidth: 1.5, borderRadius: 10, height: 35},
  wdin: {borderBottomWidth: 1, borderColor: '#0000ff'},
});
