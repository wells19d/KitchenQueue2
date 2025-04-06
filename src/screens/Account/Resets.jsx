//* Resets.jsx
import React from 'react';
import {View, Alert} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {ScreenStyles} from '../../styles/Styles';
import {Layout, ScrollView, Text} from '../../KQ-UI';
import TellMeButton from '../../components/TellMeButton';
import {useCoreInfo} from '../../utilities/coreInfo';

const Resets = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const core = useCoreInfo();
  const dispatch = useDispatch();

  const resetCupboard = () => {
    if (core?.role === 'owner') {
      Alert.alert(
        'Reset Cupboard',
        'Are you sure you want to reset your cupboard? This is a destructive action and cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            style: 'destructive',
            onPress: () => {
              dispatch({
                type: 'RESET_CUPBOARD',
                payload: {
                  cupboardID: core?.cupboardID,
                  profileID: core?.profileID,
                },
              });
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Reset Cupboard',
        'You do not have permission to reset the cupboard. Only the account owner can do this.',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
      );
    }
  };
  const resetShoppingList = () => {
    Alert.alert(
      'Reset Shopping List',
      'Are you sure you want to reset your shopping list? This is a destructive action and cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'RESET_SHOP_CART',
              payload: {
                shoppingCartID: core?.shoppingCartID,
                profileID: core?.profileID,
              },
            });
          },
        },
      ],
    );
  };

  return (
    <Layout
      bgColor={bgColor}
      headerTitle={title}
      headerColor={headerColor}
      textColor={textColor}
      LeftButton="Back"
      RightButton=""
      LeftAction={null}
      RightAction={null}
      sheetOpen={false}
      // outerViewStyles={{paddingBottom: 0}}
    >
      <View style={[ScreenStyles.viewContainer, {flex: 1}]}>
        <View style={ScreenStyles.viewInnerTopContainer}>
          <Text size="small" font="open-7" centered>
            Tell me about...
          </Text>
        </View>
        <ScrollView contentContainerStyle={ScreenStyles.scrollContainer}>
          <TellMeButton
            profile={core?.userSettings?.hapticStrength}
            action={resetCupboard}
            tt1="Reset My Cupboard"
            tt2="Clears all items from my cupboard."
          />
          <TellMeButton
            profile={core?.userSettings?.hapticStrength}
            action={resetShoppingList}
            tt1="Reset My Shopping List"
            tt2="Clears all items from my shopping list."
          />
        </ScrollView>
      </View>
    </Layout>
  );
};

export default Resets;
