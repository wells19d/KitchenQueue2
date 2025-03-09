//* Home.jsx
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Platform, View} from 'react-native';
import {useDeviceInfo} from '../../hooks/useHooks';
import {isHBDevice} from '../../utilities/deviceUtils';
import {Text} from '../../KQ-UI/KQText';

const Home = () => {
  const route = useRoute();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;
  const device = useDeviceInfo();

  const Row = ({children}) => (
    <View style={{flexDirection: 'row', width: '90%'}}>{children}</View>
  );

  const Cell = ({children}) => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
      }}>
      {children}
    </View>
  );

  const TextBefore = ({font, text, weight, size}) => (
    <Text
      kqColor="black"
      style={{fontFamily: font, fontWeight: weight, fontSize: size || 20}}>
      {text}
    </Text>
  );

  const TextAfter = ({font, text, size}) => (
    <Text kqColor="black" font={font} style={{fontSize: size || 20}}>
      {text}
    </Text>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: bgColor,
      }}>
      <Row>
        <Cell>
          <TextBefore font="NotoSans-Light" weight={300} text="Noto 300" />
        </Cell>
        <Cell>
          <TextAfter font="Noto-3" text="Noto 300" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="NotoSans-Medium" weight={500} text="Noto 500" />
        </Cell>
        <Cell>
          <TextAfter font="Noto-5" text="Noto 500" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="NotoSans-Bold" weight={700} text="Noto 700" />
        </Cell>
        <Cell>
          <TextAfter font="Noto-7" text="Noto 700" />
        </Cell>
      </Row>

      <Row>
        <Cell>
          <TextBefore font="Montserrat-Light" weight={200} text="Mont 300" />
        </Cell>
        <Cell>
          <TextAfter font="Mont-3" text="Mont 300" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="Montserrat-Medium" weight={400} text="Mont 500" />
        </Cell>
        <Cell>
          <TextAfter font="Mont-5" text="Mont 500" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="Montserrat-Bold" weight={700} text="Mont 700" />
        </Cell>
        <Cell>
          <TextAfter font="Mont-7" text="Mont 700" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="OpenSans-Light" weight={300} text="Open 300" />
        </Cell>
        <Cell>
          <TextAfter font="open-3" text="Open 300" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="OpenSans-Medium" weight={500} text="Open 500" />
        </Cell>
        <Cell>
          <TextAfter font="open-5" text="Open 500" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore font="OpenSans-Bold" weight={700} text="Open 700" />
        </Cell>
        <Cell>
          <TextAfter font="open-7" text="Open 700" />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore
            font={Platform.OS === 'ios' ? 'CherryBlossom' : 'Cherry-Blossom'}
            weight={500}
            size={22}
            text="Cherry Blossom"
          />
        </Cell>
        <Cell>
          <TextAfter font="cherry" text="Cherry Blossom" size={22} />
        </Cell>
      </Row>
      <Row>
        <Cell>
          <TextBefore
            font="BananaChips-Regular"
            text="Banana Chips"
            size={40}
            weight={500}
          />
        </Cell>
        <Cell>
          <TextAfter font="banana" text="Banana Chips" size={40} />
        </Cell>
      </Row>
      <Text font="open-6" size="large">
        The quick brown lazy dog.
      </Text>
    </View>
  );
};

export default Home;
