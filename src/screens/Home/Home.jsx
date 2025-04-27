//* Home.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';
import {useCupboard, useShoppingCart} from '../../hooks/useHooks';

const Home = () => {
  const route = useRoute();
  const shopping = useShoppingCart();
  const shoppingList =
    shopping?.items?.filter(item => item.status === 'shopping-list') ?? [];
  const shoppingCart =
    shopping?.items.filter(item => item?.status === 'shopping-cart') ?? [];
  const cupboard = useCupboard();
  const cupboardList = cupboard?.items ?? [];
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

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
      <Text>Home</Text>
    </Layout>
  );
};

export default Home;
