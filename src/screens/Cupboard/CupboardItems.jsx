//* CupboardItems.jsx

import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Dropdown, Input, Layout} from '../../KQ-UI';
import {useCupboard} from '../../hooks/useHooks';
import {displayMeasurements} from '../../utilities/measurements';
import {displayCategories} from '../../utilities/categories';
import {displayCustom, setNumericValue} from '../../utilities/helpers';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useCoreInfo} from '../../utilities/coreInfo';

const CupboardItems = () => {
  const route = useRoute();
  const {title, bgColor, textColor, headerColor, itemId, navigateBackTo} =
    route.params || {};

  const dispatch = useDispatch();
  const core = useCoreInfo();
  const navigation = useNavigation();
  const cupboard = useCupboard();

  const itemToUpdate =
    cupboard?.items?.find(item => item.itemId === itemId) ?? null;

  const [itemName, setItemName] = useState(itemToUpdate?.itemName ?? null);
  const [brandName, setBrandName] = useState(itemToUpdate?.brandName ?? '');
  const [description, setDescription] = useState(
    itemToUpdate?.description ?? '',
  );
  const [packageSize, setPackageSize] = useState(
    String(itemToUpdate?.packageSize ?? '1'),
  );
  const [remainingAmount, setRemainingAmount] = useState(
    String(itemToUpdate?.quantity ?? '1'),
  );
  const [measurement, setMeasurement] = useState(
    displayCustom(itemToUpdate?.measurement, displayMeasurements) ?? null,
  );
  const [category, setCategory] = useState(
    displayCustom(itemToUpdate?.category, displayMeasurements) ?? null,
  );
  const [notes, setNotes] = useState(itemToUpdate?.notes ?? '');

  const [validation, setValidation] = useState(false);
  const [remainValidation, setRemainValidation] = useState(false);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    if (itemName === null) {
      setValidation(false);
      setCanSave(false);
    } else if (itemName === '') {
      setValidation(true);
      setCanSave(false);
    } else {
      setValidation(false);
      setCanSave(true);
    }
  }, [itemName]);

  useEffect(() => {
    setRemainingAmount(packageSize);
  }, [packageSize]);

  const handleRemainingAmountChange = value => {
    const numericValue = Number(value);
    if (numericValue > Number(packageSize)) {
      setRemainValidation(true);
    } else {
      setRemainValidation(false);
    }
    setRemainingAmount(value);
  };

  const handlePackageChange = value => {
    setNumericValue(setPackageSize(value));
    setNumericValue(setRemainingAmount(value));
  };

  const resetForm = () => {
    setItemName(null);
    setBrandName('');
    setDescription('');
    setPackageSize('1');
    setRemainingAmount('1');
    setMeasurement(null);
    setCategory(null);
    setNotes('');
  };

  const SaveItem = () => {
    if (itemName === '' || itemName === null) {
      setValidation(true);
    } else {
      setValidation(false);

      const newItem = {
        itemName: itemName || '',
        brandName: brandName || '',
        description: description || '',
        packageSize: Number(packageSize) > 0 ? Number(packageSize) : 1,
        remainingAmount:
          Number(remainingAmount) > 0 ? Number(remainingAmount) : 1,
        measurement: measurement?.key || '',
        category: category?.key || '',
        notes: notes || '',
      };

      const updatedItem = {
        ...itemToUpdate,
        ...newItem,
      };

      if (itemToUpdate) {
        dispatch({
          type: 'UPDATE_ITEM_IN_CUPBOARD',
          payload: {
            cupboardID: core.cupboardID,
            updatedItem,
            profileID: core.profileID,
          },
        });
      } else {
        dispatch({
          type: 'ADD_ITEM_TO_CUPBOARD',
          payload: {
            cupboardID: core.cupboardID,
            newItem,
            profileID: core.profileID,
          },
        });
      }

      resetForm();
    }
  };

  const handleClose = () => {
    // dispatch({type: 'RESET_FOOD_DATA'}); // this is for edamam later
    resetForm();
    // setStoredData(null); // this is for edamam later
    navigation.navigate(navigateBackTo);
  };

  const displayRemaining = (packageSize, remainingAmount) => {
    let percent = (remainingAmount / packageSize) * 100;
    return `${percent.toFixed(0)}% left in package`;
  };

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton="Close"
      RightButton={canSave ? 'Save' : null}
      LeftAction={handleClose}
      RightAction={canSave ? SaveItem : null}
      sheetOpen={false}
      outerViewStyles={{paddingBottom: 0}}>
      <Input
        required
        label="Item Name"
        value={itemName}
        onChangeText={setItemName}
        validation={validation}
        validationMessage="Item Name is required"
        capitalize
        capitalMode="words"
      />
      <Input
        label="Brand Name"
        value={brandName}
        onChangeText={setBrandName}
        capitalize
        capitalMode="words"
      />
      <Input
        label="Description"
        value={description}
        onChangeText={setDescription}
        capitalize
        capitalMode="sentences"
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Input
            label="Package Size"
            value={packageSize}
            onChangeText={setNumericValue(setPackageSize)}
            caption="Example: 12 Eggs"
            capitalMode="sentences"
          />
        </View>
        <View style={{flex: 1}}>
          <Input
            label="Remaining Amount"
            value={remainingAmount}
            onChangeText={handleRemainingAmountChange}
            caption={displayRemaining(packageSize, remainingAmount)}
            // capitalMode="sentences"
          />
        </View>
      </View>
      <Dropdown
        label="Measurement"
        customLabel="Custom Measurement"
        placeholder="Select a measurement"
        value={measurement}
        setValue={setMeasurement}
        caption={'Single is for individual items. Ex: Eggs'}
        mapData={displayMeasurements}
      />
      <Dropdown
        label="Category"
        placeholder="Select a category"
        value={category}
        setValue={setCategory}
        mapData={displayCategories}
      />
      <Input
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        multiHeight="large"
        caption="Add notes here"
        counter
        maxCount={250}
      />
    </Layout>
  );
};

export default CupboardItems;
