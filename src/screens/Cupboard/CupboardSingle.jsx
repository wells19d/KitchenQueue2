//* CupboardSingle.jsx
import React, {useCallback, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BottomSheet, Layout, Text} from '../../KQ-UI';
import {useAccount, useCupboard} from '../../hooks/useHooks';
import {useDispatch} from 'react-redux';
import {ListStyles} from '../../styles/Styles';
import {View} from 'react-native';
import SwipeableItem from '../../components/SwipeableItem';
import {useCoreInfo} from '../../utilities/coreInfo';
import SelectedItemInfo from '../../components/SelectedItemInfo';

const CupboardSingle = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const core = useCoreInfo();
  const account = useAccount();
  const cupboard = useCupboard();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cupboardList = cupboard?.items ?? [];

  const [showItemInfo, setShowItemInfo] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleUpdateItem = itemId => {
    navigation.navigate('CupboardItems', {
      title: 'Update Item',
      itemId,
      navigateBackTo: 'CupboardList-Single',
    });
  };

  const handleDeleteItem = useCallback(
    itemId => {
      if (core.profileID) {
        const item = cupboardList?.find(item => item?.itemId === itemId);
        if (item) {
          dispatch({
            type: 'DELETE_ITEM_FROM_CUPBOARD',
            payload: {
              cupboardID: core.cupboardID,
              itemId: item.itemId,
              itemName: item.itemName,
              profileID: core.profileID,
            },
          });
        }
      }
    },
    [dispatch, core, cupboardList],
  );

  const SelectedItem = () => (
    <BottomSheet
      visible={showItemInfo}
      onClose={() => setShowItemInfo(false)}
      snapPoints={[0.01, 0.9]}>
      <SelectedItemInfo
        cupboardView
        selectedItem={selectedItem}
        setShowItemInfo={setShowItemInfo}
        navigate={{to: 'CupboardItems', backTo: 'CupboardList-Single'}}
      />
    </BottomSheet>
  );

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton={cupboardList.length === 0 ? null : 'Split'}
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}>
      {cupboardList.length === 0 ? (
        <View
          style={[
            ListStyles.viewContainer,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text>Cupboards are Empty</Text>
        </View>
      ) : (
        <View style={ListStyles.viewContainer}>
          <SwipeableItem
            core={core}
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
          <SelectedItem />
        </View>
      )}
    </Layout>
  );
};

export default CupboardSingle;
