//* ShoppingList.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useShoppingCart} from '../../hooks/useHooks';
import {View} from 'react-native';
import {ListStyles} from '../../styles/Styles';
import SwipeableItem from '../../components/SwipeableItem';
import {useDispatch} from 'react-redux';
import {useCoreInfo} from '../../utilities/coreInfo';

const ShoppingList = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const shopping = useShoppingCart();
  const navigation = useNavigation();
  const core = useCoreInfo();
  const dispatch = useDispatch();

  const shoppingList =
    shopping?.items?.filter(item => item.status === 'shopping-list') ?? [];

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = useCallback(
    itemId => {
      const item = shoppingList.find(item => item.itemId === itemId);
      if (item && core.profileID) {
        const updatedItem = {
          ...item,
          status: 'shopping-cart',
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: core.profileID,
        };
        dispatch({
          type: 'UPDATE_ITEM_IN_SHOP_CART',
          payload: {
            shoppingCartID: core.shoppingCartID,
            updatedItem,
            profileID: core.profileID,
            updateType: 'toCart',
          },
        });
      }
    },
    [dispatch, core.profileID, shoppingList],
  );

  const handleUpdateItem = itemId => {
    navigation.navigate('ShoppingItems', {
      title: 'Update Item',
      itemId,
      navigateBackTo: 'ShoppingList',
      statusTo: 'shopping-list',
    });
  };

  const handleDeleteItem = useCallback(
    itemId => {
      if (core.profileID) {
        const item = shoppingList.find(item => item.itemId === itemId);
        if (item) {
          dispatch({
            type: 'DELETE_ITEM_FROM_SHOP_CART',
            payload: {
              shoppingCartID: core.shoppingCartID,
              itemId: item.itemId,
              itemName: item.itemName,
              profileID: core.profileID,
            },
          });
        }
      }
    },
    [dispatch, core.profileID, shoppingList],
  );

  const SelectedItemInfo = ({navigate}) => (
    <BottomSheet
      visible={showItemInfo}
      onClose={() => setShowItemInfo(false)}
      snapPoints={[0.01, 0.9]}>
      <Text>{JSON.stringify(selectedItem)}</Text>
    </BottomSheet>
  );

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton=""
      RightButton="To-Cart"
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      innerViewStyles={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      outerViewStyles={{paddingBottom: 0}}>
      {shoppingList.length === 0 ? (
        <View
          style={[
            ListStyles.viewContainer,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text>Shopping List is Empty</Text>
        </View>
      ) : (
        <View style={ListStyles.viewContainer}>
          <SwipeableItem
            list={shoppingList}
            core={core}
            showItemInfo={showItemInfo}
            setShowItemInfo={setShowItemInfo}
            setSelectedItem={setSelectedItem}
            rightButtons={[
              {
                action: itemId => handleAddToCart(itemId),
                text1: 'Add',
                text2: 'to Cart',
                style: ListStyles.addButton,
              },
              {
                action: itemId => handleUpdateItem(itemId),
                navigateBackTo: 'ShoppingList',
                text1: 'Update',
                text2: 'Item',
                style: ListStyles.updateButton,
              },
              {
                action: itemId => handleDeleteItem(itemId),
                text1: 'Delete',
                style: ListStyles.deleteButton,
              },
            ]}
            leftButtons={[]}
          />
          <SelectedItemInfo
            navigate={{to: 'UpdateShopItems', backTo: 'ShoppingList'}}
          />
        </View>
      )}
    </Layout>
  );
};

export default ShoppingList;
