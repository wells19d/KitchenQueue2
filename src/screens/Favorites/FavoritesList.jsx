//* FavoritesList.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useFavorites} from '../../hooks/useHooks';
import {View} from 'react-native';
import {ListStyles} from '../../styles/Styles';
import SwipeableItem from '../../components/SwipeableItem';
import {useDispatch} from 'react-redux';
import {useCoreInfo} from '../../utilities/coreInfo';
import SelectedItemInfo from '../../components/SelectedItemInfo';

const FavoritesList = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const favorites = useFavorites();
  const navigation = useNavigation();
  const core = useCoreInfo();
  const dispatch = useDispatch();

  const favoritesList = favorites?.items ?? [
    {
      brandName: 'Fairlife',
      category: 'dairy',
      createdBy: 'bLZNlr9Zu2ZBPtG8jkdaoAEMCLy2',
      description: '2% Ultra Filtered',
      itemDate: '2025-05-26T15:54:27.998Z',
      itemId: '69c9b5f9-68f1-47c9-b4a9-62bb88cdb4e2',
      itemName: 'Milk',
      lastUpdated: '2025-06-01T15:10:46.984Z',
      lastUpdatedBy: 'bLZNlr9Zu2ZBPtG8jkdaoAEMCLy2',
      measurement: 'fluidounce',
      notes: 'Something here',
      packageSize: 52,
    },
    {
      brandName: 'Simply',
      category: 'beverages',
      createdBy: 'bLZNlr9Zu2ZBPtG8jkdaoAEMCLy2',
      description: 'w/ Mango',
      itemDate: '2025-05-26T15:54:27.998Z',
      itemId: '69c9b5f9-68f1-47c9-b4a9-62bb88cdb4e3',
      itemName: 'Orange Juice',
      lastUpdated: '2025-06-01T15:10:46.984Z',
      lastUpdatedBy: 'bLZNlr9Zu2ZBPtG8jkdaoAEMCLy2',
      measurement: 'fluidounce',
      notes: 'No Pulp',
      packageSize: 52,
    },
  ];

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = itemId => {
    //     const latestItem = favorites?.items?.find(i => i.itemId === itemId);
    //     const fallbackItem = selectedItem?.itemId === itemId ? selectedItem : null;
    //     const item = latestItem || fallbackItem;
    //     if (item && core.profileID) {
    //       const updatedItem = {
    //         ...item,
    //         status: 'shopping-cart',
    //         lastUpdated: new Date().toISOString(),
    //         lastUpdatedBy: core.profileID,
    //       };
    //       dispatch({
    //         type: 'UPDATE_ITEM_IN_SHOP_CART',
    //         payload: {
    //           shoppingCartID: core.shoppingCartID,
    //           updatedItem,
    //           profileID: core.profileID,
    //           updateType: 'toCart',
    //         },
    //       });
    //     }
  };

  const handleUpdateItem = itemId => {
    //     navigation.navigate('FavoriteItems', {
    //       title: 'Update Item',
    //       itemId,
    //       navigateBackTo: 'FavoritesList',
    //       statusTo: 'shopping-list',
    //     });
  };

  const handleDeleteItem = useCallback();
  //     itemId => {
  //       if (core.profileID) {
  //         const item = favoritesList.find(item => item.itemId === itemId);
  //         if (item) {
  //           dispatch({
  //             type: 'DELETE_ITEM_FROM_SHOP_CART',
  //             payload: {
  //               shoppingCartID: core.shoppingCartID,
  //               itemId: item.itemId,
  //               itemName: item.itemName,
  //               profileID: core.profileID,
  //             },
  //           });
  //         }
  //       }
  //     },
  //     [dispatch, core.profileID, favoritesList],

  const SelectedItem = () => (
    <BottomSheet
      visible={showItemInfo}
      onClose={() => setShowItemInfo(false)}
      snapPoints={[0.01, 0.9]}>
      <SelectedItemInfo
        selectedItem={selectedItem}
        setShowItemInfo={setShowItemInfo}
        navigate={{
          to: 'FavoriteItems',
          backTo: 'FavoritesList',
          //   statusTo: 'shopping-list',
        }}
      />
    </BottomSheet>
  );

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton=""
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}>
      {favoritesList.length === 0 ? (
        <View
          style={[
            ListStyles.viewContainer,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text>Favorites List is Empty</Text>
        </View>
      ) : (
        <View style={ListStyles.viewContainer}>
          <SwipeableItem
            list={favoritesList}
            core={core}
            showItemInfo={showItemInfo}
            setShowItemInfo={setShowItemInfo}
            setSelectedItem={setSelectedItem}
            // cupboardView
            noQuantity
            rightButtons={[
              {
                action: itemId => handleAddToCart(itemId),
                text1: 'Add',
                text2: 'to List',
                style: ListStyles.addButton,
              },
              {
                action: itemId => handleUpdateItem(itemId),
                navigateBackTo: 'FavoritesList',
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
          <SelectedItem />
        </View>
      )}
    </Layout>
  );
};

export default FavoritesList;
