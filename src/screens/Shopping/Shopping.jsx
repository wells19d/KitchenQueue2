//* Shopping.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Button, Layout, Text} from '../../KQ-UI';
import {useAccount, useProfile, useShoppingCart} from '../../hooks/useHooks';
import {shoppingBatch} from '../../../dataExport';

const Shopping = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();

  let batchFile = shoppingBatch;

  const handlePress = () => {
    console.log('batchFile', batchFile);
  };

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
      innerViewStyles={{justifyContent: 'center', alignItems: 'center'}}>
      <Text>Shopping</Text>
      <Button
        onPress={() => {
          handlePress();
        }}>
        Import list
      </Button>
    </Layout>
  );
};

export default Shopping;
