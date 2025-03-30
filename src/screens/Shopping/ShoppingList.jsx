//* ShoppingList.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useAccount, useProfile, useShoppingCart} from '../../hooks/useHooks';
import {View} from 'react-native';
import {ListStyles} from '../../styles/Styles';
import SwipeableItem from '../../components/SwipeableItem';
import {useDispatch} from 'react-redux';

const ShoppingList = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const shoppingList =
    shopping?.items?.filter(item => item.status === 'shopping-list') ?? [];

  console.log('Shopping List:', shoppingList);

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = useCallback(
    itemId => {
      const item = shoppingList.find(item => item.itemId === itemId);
      if (item && profile) {
        const updatedItem = {
          ...item,
          status: 'shopping-cart',
          lastUpdated: new Date().toISOString(),
          lastUpdatedBy: profile.id,
        };
        dispatch({
          type: 'UPDATE_ITEM_IN_SHOP_CART',
          payload: {
            shoppingCartID: account.shoppingCartID,
            updatedItem,
            profileID: profile.id,
            updateType: 'toCart',
          },
        });
      }
    },
    [dispatch, profile, shoppingList],
  );

  const handleUpdateItem = itemId => {
    navigation.navigate('UpdateShopItems', {
      itemId,
      navigateBackTo: 'ShoppingList',
    });
  };

  const handleDeleteItem = useCallback(
    itemId => {
      if (profile) {
        const item = shoppingList.find(item => item.itemId === itemId);
        if (item) {
          dispatch({
            type: 'DELETE_ITEM_FROM_SHOP_CART',
            payload: {
              shoppingCartID: account.shoppingCartID,
              itemId: item.itemId,
              itemName: item.itemName,
              profileID: profile.id,
            },
          });
        }
      }
    },
    [dispatch, profile, shoppingList],
  );

  const SelectedItemInfo = () => (
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
            profile={profile}
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
          <SelectedItemInfo />
        </View>
      )}
    </Layout>
  );
};

export default ShoppingList;
