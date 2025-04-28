//* Home.jsx
import React, {use, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {Layout, Text} from '../../KQ-UI';
import {useCoreInfo} from '../../utilities/coreInfo';
import moment from 'moment';
import {View} from 'react-native';
import {useColors} from '../../KQ-UI/KQUtilities';

const Home = () => {
  const route = useRoute();
  const core = useCoreInfo();
  const {title, headerColor, bgColor, textColor, screenLocation} = route.params;

  const greetingMsg = () => {
    if (core?.firstName) {
      return `Hello, ${core?.firstName}!`;
    } else {
      return `Hello new user!`;
    }
  };

  const displayDate = () => {
    let day = moment(new Date()).format('ddd');
    let date = moment(new Date()).format('MMM DD, YYYY');
    return `${day}, ${date}`;
  };

  const DisplayRow = ({children}) => {
    return <View style={{flexDirection: 'row'}}>{children}</View>;
  };
  const DisplayCell = ({
    title,
    subTitle,
    color,
    border,
    shadow,
    style,
    value1,
    value2,
    blank,
    header,
  }) => {
    return (
      <View
        style={{
          flex: 1,
          borderWidth: border ? 1.5 : 0,
          borderRadius: 10,
          margin: 6,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: useColors(color || 'primary30'),
          borderColor: border
            ? useColors(border || 'primary30')
            : useColors(color || 'primary30'),
          shadowColor: useColors(shadow || 'primary90'),
          shadowOffset: {
            width: 1,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 1.5,
          elevation: 8,
          justifyContent: 'center',
          minHeight: 45,
          ...style,
        }}>
        {header ? (
          <>
            <Text size="large" font="mont-7">
              {greetingMsg()}
            </Text>
            <Text size="small" font="mont-6" kqColor="dark80" italic>
              {displayDate()}
            </Text>
          </>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Text size="medium" font="mont-7" numberOfLines={1}>
                {title}:{' '}
              </Text>
            </View>
            {subTitle && (
              <View style={{justifyContent: 'center'}}>
                <Text
                  size="small"
                  font="mont-6"
                  kqColor="dark80"
                  numberOfLines={1}>
                  ({subTitle})
                </Text>
              </View>
            )}
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              {!blank ? (
                <Text size="small" font="mont-6" kqColor="dark90" italic>
                  {value1} of {value2}
                </Text>
              ) : (
                <Text size="small" font="mont-6" kqColor="dark90" italic>
                  Coming Soon...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
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
      outerViewStyles={{paddingBottom: 0}}
      innerViewStyles={{
        paddingTop: 7,
        paddingBottom: 10,
        paddingLeft: 4,
        paddingRight: 6,
      }}>
      <DisplayRow>
        <DisplayCell
          color="white"
          shadow="white"
          header
          style={{minHeight: 100, justifyContent: 'top'}}
        />
      </DisplayRow>
      <Text centered italic>
        Allowances:
      </Text>
      <DisplayRow>
        <DisplayCell
          color="success10"
          shadow="success90"
          title="Shopping"
          subTitle="List & Cart"
          value1={core?.shoppingAllItemsLength}
          value2={core?.maxShoppingItems}
        />
      </DisplayRow>
      <DisplayRow>
        <DisplayCell
          color="success10"
          shadow="success90"
          title="Cupboard"
          value1={core?.cupboardLength}
          value2={core?.maxCupboardItems}
        />
      </DisplayRow>

      {/* <DisplayRow>
        <DisplayCell color="basic" shadow="dark90" title="My Recipes" blank />
      </DisplayRow>
      <DisplayRow>
        <DisplayCell
          color="basic"
          shadow="dark90"
          title="Favorite Items"
          blank
        />
      </DisplayRow>
      <DisplayRow>
        <DisplayCell
          color="basic"
          shadow="dark90"
          title="Barcode Scans"
          blank
        />
      </DisplayRow>
      <DisplayRow>
        <DisplayCell
          color="basic"
          shadow="dark90"
          title="Recipe Searches"
          blank
        />
      </DisplayRow> */}
    </Layout>
  );
};

export default Home;
