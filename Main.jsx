//* Main.jsx
import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Dimensions, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavMenu from './src/components/NavMenu';
import {useDispatch} from 'react-redux';
import {getNavMenuHeight} from './src/utilities/deviceUtils';
import Home from './src/screens/Home/Home';
import {useAuth, useDeviceInfo, useProfile} from './src/hooks/useHooks';
import {setHapticFeedback} from './src/hooks/setHapticFeedback';
import Account from './src/screens/Account/Account';
import CupboardSingle from './src/screens/Cupboard/CupboardSingle';
import ShoppingList from './src/screens/Shopping/ShoppingList';
import CenterMenu from './src/screens/CenterMenu/CenterMenu';
import {BottomSheet, Modal, Text} from './src/KQ-UI';
import DevInputs from './src/screens/Dev/DevInputs';
import DevButtons from './src/screens/Dev/DevButtons';
import DevDropdowns from './src/screens/Dev/DevDropdowns';
import DevPlayground from './src/screens/Dev/DevPlayground';
import DevModals from './src/screens/Dev/DevModals';
import DevText from './src/screens/Dev/DevText';
import {getAuth} from '@react-native-firebase/auth';
import {getApp} from '@react-native-firebase/app';
import Auth from './src/screens/Auth/Auth';
import {
  RTAccounts,
  RTProfiles,
  RTShopping,
  RTCupboards,
  RTUsers,
  RTAllowedProfiles,
} from './src/utilities/realtime';
import TermsService from './src/screens/Legal/TermsService';
import PrivacyPolicy from './src/screens/Legal/PrivacyPolicy';
import {AppInfo} from './AppInfo';
import {enableScreens} from 'react-native-screens';
import ShoppingCart from './src/screens/Shopping/ShoppingCart';
import CupboardGroup from './src/screens/Cupboard/CupboardGroup';
import ShoppingItems from './src/screens/Shopping/ShoppingItems';
import CupboardItems from './src/screens/Cupboard/CupboardItems';
import Settings from './src/screens/Account/Settings';
import Help from './src/screens/Account/Help';
import Profile from './src/screens/Account/Profile';
import Vibrations from './src/screens/Account/Vibrations';
import ItemDisplay from './src/screens/Account/ItemDisplay';
import Resets from './src/screens/Account/Resets';

const Main = () => {
  const dispatch = useDispatch();
  const device = useDeviceInfo();
  const profile = useProfile();
  const useHaptics = setHapticFeedback();
  const Stack = createNativeStackNavigator();
  const isAuthenticated = useAuth();
  const [headerColor, setHeaderColor] = useState('black');
  const [screenLocation, setScreenLocation] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#373d43');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomHeight = getNavMenuHeight(device);

  const [showPPModal, setShowPPModal] = useState(false);
  const [showTOSModal, setShowTOSModal] = useState(true);
  const [currentModal, setCurrentModal] = useState('');
  enableScreens(true);

  RTUsers();
  RTAccounts();
  RTProfiles();
  RTShopping();
  RTCupboards();
  RTAllowedProfiles();

  useEffect(() => {
    try {
      const auth = getAuth(getApp());
      const user = auth.currentUser;

      if (user) {
        dispatch({type: 'SET_USER', payload: user});
      } else {
        dispatch({type: 'LOGOUT'});
      }
    } catch (e) {
      dispatch({type: 'LOGOUT'});
    }
  }, []);

  const borrowedParams = useMemo(
    () => ({bgColor, textColor, headerColor, screenLocation}),
    [bgColor, textColor, headerColor, screenLocation],
  );

  useEffect(() => {
    if (isAuthenticated && profile) {
      if (!profile?.tosVersion || profile?.tosVersion !== AppInfo.tosVersion) {
        setCurrentModal('TOS');
        setShowTOSModal(true);
      } else if (
        !profile?.ppVersion ||
        profile?.ppVersion !== AppInfo.ppVersion
      ) {
        setCurrentModal('PP');
        setShowPPModal(true);
      }
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    dispatch({type: 'FETCH_DEVICE_INFO'});

    const subscription = Dimensions.addEventListener('change', () => {
      dispatch({type: 'FETCH_DEVICE_INFO'});
    });

    return () => subscription?.remove();
  }, [dispatch]);

  const handlePPConfirm = () => {
    let updatedData = {
      ppVersion: AppInfo.ppVersion,
    };
    dispatch({
      type: 'UPDATE_PROFILE_REQUEST',
      payload: {userId: profile?.id, updatedData},
    });
    setShowPPModal(false);

    if (profile?.tosVersion !== AppInfo.tosVersion) {
      setCurrentModal('TOS');
      setShowTOSModal(true);
    }
  };

  const handleTOSConfirm = () => {
    let updatedData = {
      tosVersion: AppInfo.tosVersion,
    };
    dispatch({
      type: 'UPDATE_PROFILE_REQUEST',
      payload: {userId: profile?.id, updatedData},
    });
    setShowTOSModal(false);
    setCurrentModal('');
  };

  const handleCancel = type => {
    Alert.alert(
      `${type} Declined`,
      `Not accepting the ${type}, you will be logged out and prevented from using Kitchen Queue. Are you sure you want to decline?`,
      [
        {text: 'Back'},
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            dispatch({type: 'LOGOUT'});
          },
        },
      ],
    );
  };

  const toggleMenu = useCallback(() => {
    setIsSheetOpen(prev => !prev);
    useHaptics(profile?.userSettings?.hapticStrength || 'light');
  }, [useHaptics]);

  const BottomMenu = () => (
    <BottomSheet
      visible={isSheetOpen}
      onClose={() => setIsSheetOpen(false)}
      snapPoints={[0.01, 0.95]}>
      <CenterMenu borrowedParams={borrowedParams} toggleMenu={toggleMenu} />
    </BottomSheet>
  );

  const Navigation = () => {
    return (
      <>
        <Stack.Navigator
          screenOptions={{
            animation: 'none',
            gestureEnabled: false,
            headerBackVisible: false,
            headerShown: false,
            navigationBarColor: '#f7f7f7',
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Home',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Home');
              },
            }}
          />
          <Stack.Screen
            name="ShoppingList"
            component={ShoppingList}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Shopping List',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('ShoppingList');
              },
            }}
          />
          <Stack.Screen
            name="ShoppingCart"
            component={ShoppingCart}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Shopping Cart',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('ShoppingCart');
              },
            }}
          />
          <Stack.Screen
            name="ShoppingItems"
            component={ShoppingItems}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Items',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('ShoppingItems');
              },
            }}
          />
          <Stack.Screen
            name="CupboardList-Single"
            component={CupboardSingle}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Cupboards',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('CupboardList-Single');
              },
            }}
          />
          <Stack.Screen
            name="CupboardList-Group"
            component={CupboardGroup}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Cupboards',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('CupboardList-Group');
              },
            }}
          />
          <Stack.Screen
            name="CupboardItems"
            component={CupboardItems}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Items',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('CupboardItems');
              },
            }}
          />
          {/* <Stack.Screen
            name="RecipeList"
            component={Recipes}
            options={{ freezeOnBlur: true }} 
            initialParams={{
              title: 'Recipes',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('RecipeList');
              },
            }}
          /> */}
          <Stack.Screen
            name="Account"
            component={Account}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Account',
              bgColor: bgColor,
              headerColor: headerColor,
              textColor: textColor,
              screenLocation: screenLocation,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Account');
              },
            }}
          />
          <Stack.Screen
            name="AccountProfile"
            component={Profile}
            initialParams={{
              title: 'Profile',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('AccountProfile');
              },
            }}
          />
          <Stack.Screen
            name="AccountSettings"
            component={Settings}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Settings',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('AccountSettings');
              },
            }}
          />
          <Stack.Screen
            name="AccountHelp"
            component={Help}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Help',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('AccountHelp');
              },
            }}
          />
          <Stack.Screen
            name="Vibrations"
            component={Vibrations}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Vibration Settings',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Vibrations');
              },
            }}
          />
          <Stack.Screen
            name="ItemDisplay"
            component={ItemDisplay}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Item Display',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('ItemDisplay');
              },
            }}
          />
          {/* <Stack.Screen
            name="AdvancedFields"
            component={AdvancedFields}
            options={{ freezeOnBlur: true }} 
            initialParams={{
              title: 'Advanced Fields',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('AdvancedFields');
              },
            }}
          /> */}
          {/* <Stack.Screen
            name="DefaultView"
            component={DefaultGroupView}
            options={{ freezeOnBlur: true }} 
            initialParams={{
              title: 'Group View',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('DefaultView');
              },
            }}
          /> */}
          <Stack.Screen
            name="Resets"
            component={Resets}
            options={{freezeOnBlur: true}}
            initialParams={{
              title: 'Resets',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Resets');
              },
            }}
          />
          {/* <Stack.Screen
            name="Passwords"
            component={Passwords}
            options={{ freezeOnBlur: true }} 
            initialParams={{
              title: 'Passwords',
              bgColor: bgColor,
              textColor: textColor,
            }}
            listeners={{
              focus: () => {
                setBgColor('#ffffff');
                setHeaderColor('#319177');
                setTextColor('#ffffff');
                setScreenLocation('Passwords');
              },
            }}
          /> */}
          {__DEV__ && (
            <>
              <Stack.Screen
                name="DevPlayground"
                component={DevPlayground}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Playground',
                  bgColor: bgColor,
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevPlayground');
                  },
                }}
              />
              <Stack.Screen
                name="DevText"
                component={DevText}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Text',
                  bgColor: bgColor,
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevText');
                  },
                }}
              />
              <Stack.Screen
                name="DevInputs"
                component={DevInputs}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Inputs',
                  bgColor: bgColor,
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevInputs');
                  },
                }}
              />
              <Stack.Screen
                name="DevButtons"
                component={DevButtons}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Buttons',
                  bgColor: bgColor,
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevButtons');
                  },
                }}
              />
              <Stack.Screen
                name="DevModals"
                component={DevModals}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Modals',
                  bgColor: bgColor,
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevModals');
                  },
                }}
              />
              <Stack.Screen
                name="DevDropdowns"
                component={DevDropdowns}
                options={{freezeOnBlur: true}}
                initialParams={{
                  title: 'Dev Dropdowns',
                  bgColor: 'white',
                  headerColor: headerColor,
                  textColor: textColor,
                  screenLocation: screenLocation,
                }}
                listeners={{
                  focus: () => {
                    setBgColor('#ffffff');
                    setHeaderColor('#319177');
                    setTextColor('#ffffff');
                    setScreenLocation('DevDropdowns');
                  },
                }}
              />
            </>
          )}
          <Stack.Screen name="Login" component={Auth} />
        </Stack.Navigator>
      </>
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{flex: 1, margin: 5}}>
        <Auth bgColor={bgColor} />
      </SafeAreaView>
    );
  } else {
    return (
      <NavigationContainer>
        <SafeAreaView
          style={{flex: 1, backgroundColor: headerColor}}
          edges={['top']}>
          <View style={{flex: 1}}>
            <Navigation />
            <BottomMenu toggleMenu={toggleMenu} />
          </View>
        </SafeAreaView>
        <SafeAreaView style={{height: bottomHeight}} edges={['bottom']}>
          <NavMenu
            bottomHeight={bottomHeight}
            bottomWidth={device?.dimensions?.width}
            toggleMenu={toggleMenu}
            setIsSheetOpen={setIsSheetOpen}
            device={device}
          />
        </SafeAreaView>
        {currentModal === 'TOS' && (
          <Modal
            visible={showTOSModal}
            title="Terms of Service Update"
            fullScreen
            hideClose>
            <TermsService
              handleTOSConfirm={handleTOSConfirm}
              handleCancel={handleCancel}
            />
          </Modal>
        )}

        {currentModal === 'PP' && (
          <Modal
            visible={showPPModal}
            title="Privacy Policy Update"
            fullScreen
            hideClose>
            <PrivacyPolicy
              handlePPConfirm={handlePPConfirm}
              handleCancel={handleCancel}
            />
          </Modal>
        )}
      </NavigationContainer>
    );
  }
};

export default Main;
