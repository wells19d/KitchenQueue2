//* Account.jsx
import React, {use, useEffect} from 'react';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {Layout, ScrollView, Text} from '../../KQ-UI';
import {
  useAccount,
  useCupboard,
  useProfile,
  useShoppingCart,
} from '../../hooks/useHooks';
import {View} from 'react-native';

const DevPlayground = () => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const profile = useProfile();
  const account = useAccount();
  const shopping = useShoppingCart();
  const cupboard = useCupboard();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  // useEffect(() => {
  //   if (isFocused) {
  //     console.log('profile', profile);
  //     console.log('account', account);
  //     console.log('shopping', shopping);
  //     console.log('cupboard', cupboard);
  //   }
  // }, [isFocused, profile, account, shopping, cupboard]);

  const renderValue = value => {
    if (Array.isArray(value)) {
      return value.map((item, idx) => {
        if (typeof item === 'object' && item !== null) {
          return (
            <View key={idx} style={{marginLeft: 8, marginBottom: 12}}>
              <Text font="open-6" style={{marginBottom: 4}}>
                {idx}:
              </Text>
              {Object.entries(item)
                .sort(([a, b]) => a.localeCompare(b))
                .map(([k, v], subIdx) => (
                  <Text key={subIdx} font="open-5" style={{marginLeft: 16}}>
                    • {k}:{' '}
                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  </Text>
                ))}
            </View>
          );
        }

        return (
          <Text
            key={idx}
            font="open-5"
            style={{marginLeft: 16, marginBottom: 8}}>
            {idx}: {String(item)}
          </Text>
        );
      });
    }

    if (typeof value === 'object' && value !== null) {
      return Object.entries(value)
        .sort(([a, b]) => a.localeCompare(b))
        .map(([k, v], idx) => (
          <Text
            key={idx}
            font="open-5"
            style={{marginLeft: 16, marginBottom: 4}}>
            • {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
          </Text>
        ));
    }

    return (
      <Text font="open-5" style={{marginLeft: 16}}>
        {String(value)}
      </Text>
    );
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
        <View style={{borderWidth: 1, padding: 5}}>
          <Text>Profile</Text>
          {Object.entries(profile)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => (
              <View key={key} style={{marginBottom: 8}}>
                <Text font="open-7">{key}:</Text>
                {renderValue(value)}
              </View>
            ))}
        </View>
        <View style={{borderWidth: 1, padding: 5}}>
          <Text>Account</Text>
          {Object.entries(account)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => (
              <View key={key} style={{marginBottom: 8}}>
                <Text font="open-7">{key}:</Text>
                {renderValue(value)}
              </View>
            ))}
        </View>
        <View style={{borderWidth: 1, padding: 5}}>
          <Text>Shopping</Text>
          {Object.entries(shopping)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => (
              <View key={key} style={{marginBottom: 8}}>
                <Text font="open-7">{key}:</Text>
                {renderValue(value)}
              </View>
            ))}
        </View>
        <View style={{borderWidth: 1, padding: 5}}>
          <Text>Cupboard</Text>
          {Object.entries(cupboard)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => (
              <View key={key} style={{marginBottom: 8}}>
                <Text font="open-7">{key}:</Text>
                {renderValue(value)}
              </View>
            ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default DevPlayground;
