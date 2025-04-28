//* Home.jsx
import React, {useMemo} from 'react';
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

  const DisplayCell = React.memo(props => {
    const {
      title,
      subTitle,
      style,
      value1,
      value2,
      blank = false,
      header,
    } = props;
    const {color, shadow, border} = useMemo(() => {
      const newValue1 = value1 || 0;
      const newValue2 = value2 || 0;
      const percent = newValue2 !== 0 ? (newValue1 / newValue2) * 100 : 0;
      let mode = 'basic';

      if (blank) {
        mode = 'basic';
      } else if (header) {
        mode = 'header';
      } else if (percent <= 50) {
        mode = 'success';
      } else if (percent <= 85) {
        mode = 'warning';
      } else if (percent <= 100) {
        mode = 'danger';
      }

      const modeStyles = {
        success: {
          color: 'success10',
          shadow: 'success90',
          border: 'success10',
        },
        warning: {
          color: 'warning10',
          shadow: 'warning90',
          border: 'warning10',
        },
        danger: {color: 'danger10', shadow: 'danger90', border: 'danger10'},
        basic: {color: 'basic', shadow: 'dark90', border: 'basic'},
        header: {color: 'white', shadow: 'white', border: 'white'},
      };

      const selected = modeStyles[mode] || modeStyles.basic;

      return {
        color: useColors(selected.color),
        shadow: useColors(selected.shadow),
        border: useColors(selected.border),
      };
    }, [value1, value2, header]);

    return (
      <View
        style={{
          borderWidth: border ? 1.5 : 0,
          borderRadius: 10,
          margin: 6,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: color,
          borderColor: border,
          shadowColor: shadow,
          shadowOffset: {width: 1, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 1.5,
          elevation: 8,
          justifyContent: 'center',
          height: 45,
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
            <View style={{justifyContent: 'center'}}>
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
  });

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
      <DisplayCell
        header
        style={{minHeight: 100, justifyContent: 'flex-start'}}
      />
      <Text centered italic>
        Allowances:
      </Text>
      <DisplayCell
        title="Shopping"
        subTitle="List & Cart"
        value1={core?.shoppingAllItemsLength}
        value2={core?.maxShoppingItems}
      />
      <DisplayCell
        title="Cupboard"
        value1={core?.cupboardLength}
        value2={core?.maxCupboardItems}
      />
      {/* <DisplayCell title="My Recipes" blank />
      <DisplayCell title="Favorite Items" blank />
      <DisplayCell title="Barcode Scans" blank />
      <DisplayCell title="Recipe Searches" blank /> */}
    </Layout>
  );
};

export default Home;
