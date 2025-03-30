//* CupboardSingle.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useAccount, useCupboard, useProfile} from '../../hooks/useHooks';
import {useDispatch} from 'react-redux';
import {ListStyles} from '../../styles/Styles';
import {View} from 'react-native';
import SwipeableItem from '../../components/SwipeableItem';

const CupboardSingle = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const account = useAccount();
  const cupboard = useCupboard();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cupboardList = cupboard?.items ?? [];

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleUpdateItem = itemId => {
    navigation.navigate('UpdateCupboardItems', {
      itemId,
      navigateBackTo: 'CupboardList-Single',
    });
  };

  const handleDeleteItem = useCallback(
    itemId => {
      if (profile) {
        const item = cupboardList?.find(item => item?.itemId === itemId);
        if (item) {
          dispatch({
            type: 'DELETE_ITEM_FROM_CUPBOARD',
            payload: {
              cupboardID: account.cupboardID,
              itemId: item.itemId,
              itemName: item.itemName,
              profileID: profile.id,
            },
          });
        }
      }
    },
    [dispatch, profile?.account, cupboardList],
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
      LeftButton="Split"
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      innerViewStyles={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      outerViewStyles={{paddingBottom: 0}}>
      {cupboardList.length === 0 ? (
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
            list={cupboardList}
            setShowItemInfo={setShowItemInfo}
            setSelectedItem={setSelectedItem}
            cupboardView
            noQuantity
            rightButtons={[
              {
                action: itemId => handleUpdateItem(itemId),
                navigateBackTo: 'CupboardList-Single',
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

export default CupboardSingle;
