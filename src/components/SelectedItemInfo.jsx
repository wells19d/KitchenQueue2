//* SelectedItemInfo.jsx
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {ListStyles, SelectItemStyles} from '../styles/Styles';
import {categoryColors, formatCategories} from '../utilities/categories';
import {formatMeasurement} from '../utilities/measurements';
import {Button, Text, ScrollView} from '../KQ-UI';

const SelectedItemInfo = props => {
  const {
    selectedItem,
    setShowItemInfo,
    navigate,
    groupedView = false,
    cupboardView = false,
  } = props;

  const navigation = useNavigation();

  const handleUpdateItem = itemId => {
    navigation.navigate(navigate?.to, {
      itemId,
      navigateBackTo: navigate?.backTo,
    });
    setShowItemInfo(false);
  };

  const ItemRow = ({title, info, info2}) => {
    const asNote = title === 'Notes';
    const remain = title === 'Remaining Amount' || title === 'Total Remaining';

    if (!info) {
      return null;
    } else {
      return (
        <View
          style={
            asNote
              ? SelectItemStyles.itemNoteContainer
              : SelectItemStyles.itemContainer
          }>
          <View style={SelectItemStyles.titleWrap}>
            <Text size="small">{title}:</Text>
          </View>
          <View
            style={[
              asNote
                ? SelectItemStyles.infoNoteWrap
                : SelectItemStyles.infoWrap,
            ]}>
            <Text
              size="small"
              style={[
                asNote
                  ? SelectItemStyles.textNoteStyles
                  : SelectItemStyles?.textStyles,
              ]}
              numberOfLines={asNote ? 0 : 1}>
              {info}
            </Text>
          </View>
          {remain && (
            <View>
              <Text size="small" style={{paddingTop: 3, paddingHorizontal: 1}}>
                ({((info / info2) * 100).toFixed(0)}% left)
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  const BannerField = ({children, backgroundColor}) => {
    return (
      <View
        style={{
          marginHorizontal: 5,
          marginBottom: 5,
          borderRadius: 10,
          backgroundColor: backgroundColor || '#319177',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          font="banana"
          centered
          style={{
            fontSize: 65,
            color: 'white',
            position: 'relative',
            top: -9,
          }}
          numberOfLines={1}>
          {children}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {selectedItem && (
        <View style={SelectItemStyles.container}>
          <BannerField backgroundColor={categoryColors(selectedItem?.category)}>
            {formatCategories(selectedItem?.category)}
          </BannerField>
          {groupedView ? (
            <View
              style={{
                marginHorizontal: 5,
                padding: 5,
              }}>
              <Text centered size="xSmall">
                Can't update grouped items.
              </Text>
              <Text centered size="xSmall">
                Please close and select single view.
              </Text>
            </View>
          ) : (
            <View style={SelectItemStyles.updateContainer}>
              <Button
                color="info"
                type="outline"
                size="small"
                onPress={() => handleUpdateItem(selectedItem?.itemId)}>
                Update Item
              </Button>
            </View>
          )}
          <ScrollView contentContainerStyle={SelectItemStyles.infoContainer}>
            <ItemRow title="Item Name" info={selectedItem?.itemName} />
            <ItemRow title="Brand" info={selectedItem?.brandName} />
            <ItemRow title="Description" info={selectedItem?.description} />
            {!cupboardView && (
              <ItemRow title="Quantity" info={selectedItem?.quantity} />
            )}
            <ItemRow
              title={groupedView ? 'Total Remaining' : 'Remaining Amount'}
              info={selectedItem?.remainingAmount}
              info2={selectedItem?.packageSize}
            />
            <ItemRow
              title={groupedView ? 'Total Package Size' : 'Package Size'}
              info={selectedItem?.packageSize}
            />
            <ItemRow
              title="Measurement"
              info={formatMeasurement(selectedItem?.measurement)}
            />
            {selectedItem?.notes && (
              <ItemRow title="Notes" info={selectedItem?.notes} />
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SelectedItemInfo;
