//* FlashCupboardCell.jsx
import React from 'react';
import {Pressable, View} from 'react-native';
import {Text} from '../KQ-UI';
import {formatMeasurement} from '../utilities/measurements';
import pluralize from 'pluralize';
import {Icons} from './IconListRouter';

const FlashCupboardCell = props => {
  const {item, setShowItemInfo, setSelectedItem, profile} = props;

  const renderDisplayText = item => {
    const flashCellOrder = profile?.userSettings?.flashCellOrder || [];
    const displayText = flashCellOrder
      .map(field => item[field.key])
      .filter(Boolean)
      .join(' ');

    return displayText || item.itemName;
  };

  const formatMeasurementWithPlural = (packageSize, measurement, itemName) => {
    if (packageSize !== undefined && measurement !== undefined) {
      if (packageSize === 1 && measurement === 'each') {
        return '';
      }

      if (measurement === 'each') {
        return `${packageSize} ${itemName}`;
      }

      const formattedMeasurement = formatMeasurement(measurement);
      return `${packageSize} ${
        packageSize > 1 ? pluralize(formattedMeasurement) : formattedMeasurement
      }`;
    }
  };
  return (
    <Pressable
      onPress={() => {
        setSelectedItem(item);
        setShowItemInfo(true);
      }}>
      <View style={styles.cellContainer}>
        <View style={styles.qtyWrapper}>
          <View style={styles.qtyContainer}>
            <View style={styles.qtyTop}>
              <Text size="tiny">Qty</Text>
            </View>
            <View style={styles.qtyBottom}>
              <Text size="medium" numberOfLines={1}>
                {item.quantity}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.display}>
          <Text numberOfLines={1} size="small" font="open-7">
            {renderDisplayText(item)}
          </Text>
          <Text size="xSmall" numberOfLines={1}>
            {formatMeasurementWithPlural(
              item.packageSize,
              item.measurement,
              item.itemName,
            )}
          </Text>
        </View>
        <View style={styles.slideWrapper}>
          <View style={styles.slideLeft}>
            <Icons.ChevronLeft color="#373d4390" />
          </View>
          <View style={styles.slideRight}>
            <Icons.ChevronLeft color="#373d4390" />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = {
  cellContainer: {
    borderBottomWidth: 1,
    borderColor: '#373d4380',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    height: 65,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  qtyWrapper: {
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyContainer: {
    width: 50,
    height: 50,
    borderWidth: 1.25,
    borderColor: '#373d4380',
    borderRadius: 8,
    flexDirection: 'column',
    elevation: 5,
    shadowColor: '#373d4380',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    backgroundColor: '#fff',
  },
  qtyTop: {
    alignItems: 'center',
    paddingTop: 2,
  },
  qtyBottom: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 1,
  },
  display: {flex: 1, justifyContent: 'center', marginLeft: 5},
  slideWrapper: {
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  slideLeft: {position: 'absolute', left: 6},
  slideRight: {position: 'absolute', left: 12},
};

export default React.memo(FlashCupboardCell);
