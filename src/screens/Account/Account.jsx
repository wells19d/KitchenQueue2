//* Account.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';

const Account = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  return (
    <Layout
      bgColor={bgColor}
      styles={{justifyContent: 'center', alignItems: 'center'}}>
      <Text>Account</Text>
    </Layout>
  );
};

export default Account;
