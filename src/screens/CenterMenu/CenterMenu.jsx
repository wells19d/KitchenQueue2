//*CenterMenu.jsx
import React, {useCallback, useReducer} from 'react';
import {Alert, ScrollView, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useProfile, useShoppingCart} from '../../hooks/useHooks';
import {setHapticFeedback} from '../../hooks/setHapticFeedback';
import {menuArray} from './CenterMenuArray';
import {Icons} from '../../components/IconListRouter';
import {CMStyles} from '../../styles/Styles';
import {Text} from '../../KQ-UI';

function CenterMenu(props) {
  const {toggleMenu} = props;
  const navigation = useNavigation();
  const useHaptics = setHapticFeedback();
  const dispatch = useDispatch();
  const profile = useProfile();
  const shopping = useShoppingCart();
  const cartList =
    shopping?.items?.filter(item => item.status === 'shopping-cart') ?? [];

  const handleOnPress = useCallback(
    navigate => {
      if (navigate === 'console') return;
      if (navigate === 'Logout') {
        handleSignOut();
        return;
      }
      useHaptics(profile?.userSettings?.hapticStrength || 'light');
      toggleMenu();
      navigation.navigate(navigate);
    },
    [profile?.userSettings?.hapticStrength, toggleMenu, navigation],
  );

  const handleSignOut = useCallback(() => {
    Alert.alert('Logging Out', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'destructive'},
      {
        text: 'Confirm',
        onPress: () => {
          useHaptics(profile?.userSettings?.hapticStrength || 'light');
          dispatch({type: 'LOGOUT'});
        },
      },
    ]);
  }, [profile?.userSettings?.hapticStrength, dispatch]);

  const sectionReducer = (state, action) => {
    return {...state, [action]: !state[action]};
  };

  const initialState = menuArray.reduce((acc, section) => {
    acc[section.section] = section.defaultOpen;
    return acc;
  }, {});

  const [sectionStates, dispatchSection] = useReducer(
    sectionReducer,
    initialState,
  );

  const toggleSection = useCallback(
    sectionName => dispatchSection(sectionName),
    [dispatchSection],
  );

  const SectionHeader = React.memo(({title, state, onPress}) => {
    return (
      <View style={CMStyles.shContainer}>
        <View style={CMStyles.shLine}></View>
        <View style={{flex: 1, zIndex: 2}}>
          <View style={[CMStyles.shTWrap, {flex: 1}]}>
            <TouchableOpacity style={CMStyles.shTO} onPress={onPress}>
              {state ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={CMStyles.shTitleWrap}>
          <View style={CMStyles.shTitle}>
            <Text>{title}</Text>
          </View>
        </View>
      </View>
    );
  });

  const Section = React.memo(({title, state, onPress, data}) => {
    return (
      <>
        <SectionHeader title={title} state={state} onPress={onPress} />
        {state ? (
          <View style={CMStyles.sectionExpanded}>
            {data.map((item, index) =>
              item.action === 'InCart' && cartList.length === 0 ? null : (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOnPress(item.action)}
                  style={CMStyles.sectionTO}>
                  <View style={CMStyles.sectionIcon}>{item.icon}</View>
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        ) : (
          <View style={CMStyles.sectionCollapsed}>
            <Text size="xSmall">(Hidden: Expand to View)</Text>
          </View>
        )}
      </>
    );
  });

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      {menuArray.map((section, index) => (
        <Section
          key={index}
          title={section.section}
          state={sectionStates[section.section]}
          onPress={() => toggleSection(section.section)}
          data={section.items}
        />
      ))}
    </ScrollView>
  );
}

export default CenterMenu;
