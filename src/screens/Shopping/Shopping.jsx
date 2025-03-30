//* Shopping.jsx
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useAccount, useProfile, useShoppingCart} from '../../hooks/useHooks';
import {View} from 'react-native';
import {ListStyles} from '../../styles/Styles';
import SwipeableItem from '../../components/SwipeableItem';

const Shopping = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();

  const shoppingList = shopping?.items.filter(
    item => item?.status === 'shopping-list',
  );

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
      RightButton=""
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
                // action: itemId => handleAddToCart(itemId),
                action: itemId => console.log('Add to Cart', itemId),
                text1: 'Add',
                text2: 'to Cart',
                style: ListStyles.addButton,
              },
              {
                // action: itemId => handleUpdateItem(itemId),
                action: itemId => console.log('Update Item', itemId),
                navigateBackTo: 'ShoppingList',
                text1: 'Update',
                text2: 'Item',
                style: ListStyles.updateButton,
              },
              {
                // action: itemId => handleDeleteItem(itemId),
                action: itemId => console.log('Delete Item', itemId),
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

export default Shopping;
