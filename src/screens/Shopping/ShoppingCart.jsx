//* ShoppingCart.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useAccount, useProfile, useShoppingCart} from '../../hooks/useHooks';
import {Alert, View} from 'react-native';
import {ListStyles} from '../../styles/Styles';
import SwipeableItem from '../../components/SwipeableItem';
import {useDispatch} from 'react-redux';

const ShoppingCart = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const shoppingCart = shopping?.items.filter(
    item => item?.status === 'shopping-cart',
  );

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleReturnToList = useCallback(
    itemId => {
      const item = shoppingCart.find(item => item.itemId === itemId);
      if (item && profile) {
        const updatedItem = {...item, status: 'shopping-list'};
        dispatch({
          type: 'UPDATE_ITEM_IN_SHOP_CART',
          payload: {
            accountID: profile?.account,
            updatedItem,
            updateType: 'toList',
          },
        });
      }
    },
    [dispatch, profile, shoppingCart],
  );

  const handleUpdateItem = itemId => {
    navigation.navigate('UpdateShopItems', {
      itemId,
      navigateBackTo: 'InCart',
    });
  };

  const handleDeleteItem = useCallback(
    itemId => {
      if (profile) {
        const item = shoppingCart.find(item => item.itemId === itemId);
        if (item) {
          dispatch({
            type: 'DELETE_ITEM_FROM_SHOP_CART',
            payload: {
              accountID: profile?.account,
              itemId,
              itemName: item.itemName,
            },
          });
        }
      }
    },
    [dispatch, profile, shoppingCart],
  );

  const AddToCupboard = () => {
    if (shoppingCart?.length > 0) {
      Alert.alert(
        'Confirm Checkout',
        'Are you ready move your shopping cart items to your cupboard?',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'Confirm',
            onPress: () => {
              dispatch({
                type: 'BATCH_ADD_TO_CUPBOARD',
                payload: {
                  accountID: profile?.account,
                  items: cartList,
                },
              });
              dispatch({
                type: 'DELETE_LIST_FROM_SHOP_CART',
                payload: {
                  accountID: profile?.account,
                  items: cartList,
                },
              });
              navigation.navigate('CupboardList');
            },
          },
        ],
      );
    }
  };

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
      LeftButton="To-List"
      RightButton="Checkout"
      LeftAction={null}
      RightAction={AddToCupboard}
      sheetOpen={false}
      innerViewStyles={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      outerViewStyles={{paddingBottom: 0}}>
      {shoppingCart.length === 0 ? (
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
            list={shoppingCart}
            profile={profile}
            showItemInfo={showItemInfo}
            setShowItemInfo={setShowItemInfo}
            setSelectedItem={setSelectedItem}
            rightButtons={[
              {
                action: itemId => handleReturnToList(itemId),
                text1: 'Return',
                text2: 'to List',
                style: ListStyles.addButton,
              },
              {
                action: itemId => handleUpdateItem(itemId),
                navigateBackTo: 'InCart',
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

export default ShoppingCart;
