//* Account.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, ScrollView, Text} from '../../KQ-UI';
import {useAccount, useProfile} from '../../hooks/useHooks';
import {View} from 'react-native';

const Account = () => {
  const route = useRoute();
  const profile = useProfile();
  const account = useAccount();

  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  const renderValue = value => {
    if (Array.isArray(value)) {
      return value.map((item, idx) => (
        <Text key={idx} font="open-5" style={{marginLeft: 16}}>
          • {typeof item === 'object' ? JSON.stringify(item) : String(item)}
        </Text>
      ));
    }

    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([k, v], idx) => (
        <Text key={idx} font="open-5" style={{marginLeft: 16}}>
          • {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
        </Text>
      ));
    }

    return <Text font="open-5">{String(value)}</Text>;
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
      innerViewStyles={{}}>
      <ScrollView>
        {Object.entries(profile).map(([key, value]) => (
          <View key={key} style={{marginBottom: 8}}>
            <Text font="open-7">{key}:</Text>
            {renderValue(value)}
          </View>
        ))}
        {Object.entries(account).map(([key, value]) => (
          <View key={key} style={{marginBottom: 8}}>
            <Text font="open-7">{key}:</Text>
            {renderValue(value)}
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
};

export default Account;
