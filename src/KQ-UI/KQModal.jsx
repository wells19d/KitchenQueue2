//* KQModal.jsx
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Modal,
  StatusBar,
  Pressable,
  Dimensions,
} from 'react-native';
import {Icons} from '../components/IconListRouter';
import {Text} from '../KQ-UI';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {useProfile} from '../hooks/useHooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColors} from './KQUtilities';

const KQModal = ({
  visible,
  header = '',
  children,
  height = '90%',
  width = '90%',
  headerFont = 'open-6',
  headerSize = 'small',
  headerColor = 'white',
  hideHeader = false,
  hideTitle = false,
  hideClose = false,
  fullScreen = false,
  hapticFeedback = 'light',
  onClose,
}) => {
  const useHaptics = setHapticFeedback();
  const profile = useProfile();
  const insets = useSafeAreaInsets();
  const isClosingRef = useRef(false);

  const handleClose = (event = null) => {
    const isBackdropTap = event?.target === event?.currentTarget;
    const isManualCall = !event;

    if ((isBackdropTap || isManualCall) && !isClosingRef.current) {
      isClosingRef.current = true;

      useHaptics(profile?.userSettings?.hapticStrength || hapticFeedback);
      Keyboard.dismiss();

      setTimeout(() => {
        onClose?.();
        isClosingRef.current = false;
      }, 100);
    }
  };

  const Header = () => {
    if (hideHeader) {
      return null;
    }
    return (
      <View style={styles.headerWrapper(fullScreen)}>
        <View style={styles.headerContainer}>
          {!hideTitle && (
            <Text
              kqColor={useColors(headerColor)}
              font={headerFont}
              size={headerSize}>
              {header}
            </Text>
          )}
        </View>
        {!hideClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleClose()}>
            <Icons.Close size={25} color={'white'} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const [screenSize, setScreenSize] = useState({
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      });
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateScreenSize,
    );

    return () => subscription?.remove();
  }, []);

  const prsHeight = Math.min(Math.max(parseFloat(height), 75), 100);
  const prsWidth = Math.min(Math.max(parseFloat(width), 75), 100);

  const topHeight = fullScreen
    ? 0
    : insets.top + (screenSize.height - (screenSize.height * prsHeight) / 100);
  const btmHeight = fullScreen
    ? 0
    : insets.bottom +
      (screenSize.height - (screenSize.height * prsHeight) / 100);
  const midHeight = screenSize.height - topHeight - btmHeight;

  const midLeftWidth = fullScreen
    ? 0
    : insets.left + (screenSize.width - (screenSize.width * prsWidth) / 100);
  const midRightWidth = fullScreen
    ? 0
    : insets.right + (screenSize.width - (screenSize.width * prsWidth) / 100);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      onRequestClose={handleClose}>
      <StatusBar
        barStyle={fullScreen ? 'dark-content' : 'light-content'}
        backgroundColor={'rgba(0,0,0,0.5)'}
        translucent
      />
      <View style={styles.wrapper}>
        <Pressable
          style={styles.pressTop(topHeight, screenSize)}
          onPress={handleClose}
        />
        <View style={styles.container}>
          <Pressable
            style={styles.pressLeft(midLeftWidth, midHeight)}
            onPress={handleClose}
          />
          <View style={styles.subContainer(fullScreen, midHeight, insets)}>
            <Header />
            <View style={{flex: 1}}>{children}</View>
          </View>
          <Pressable
            style={styles.pressRight(midRightWidth, midHeight)}
            onPress={handleClose}
          />
        </View>
        <Pressable
          style={styles.pressBtm(btmHeight, screenSize)}
          onPress={handleClose}
        />
      </View>
    </Modal>
  );
};

export default React.memo(KQModal);

const styles = {
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pressTop: (topHeight, screenSize) => ({
    height: topHeight,
    width: screenSize.width,
    backgroundColor: 'transparent',
  }),
  pressBtm: (btmHeight, screenSize) => ({
    height: btmHeight,
    width: screenSize.width,
    backgroundColor: 'transparent',
  }),
  pressLeft: (midLeftWidth, midHeight) => ({
    width: midLeftWidth,
    height: midHeight,
    backgroundColor: 'transparent',
  }),
  pressRight: (midRightWidth, midHeight) => ({
    width: midRightWidth,
    height: midHeight,
    backgroundColor: 'transparent',
  }),
  container: {flex: 1, flexDirection: 'row'},
  subContainer: (fullScreen, midHeight, insets) => ({
    flex: 1,
    height: midHeight,
    borderWidth: 1,
    borderColor: '#319177',
    backgroundColor: '#fff',
    paddingTop: fullScreen ? insets.top : 0,
    paddingBottom: fullScreen ? insets.bottom : 0,
    borderRadius: fullScreen ? 0 : 10,
    shadowColor: fullScreen ? '' : 'black',
    shadowOffset: fullScreen ? {} : {width: 3, height: 4},
    shadowOpacity: fullScreen ? 0 : 0.5,
    elevation: fullScreen ? 0 : 7,
  }),

  headerWrapper: fullScreen => ({
    flexDirection: 'row',
    borderWidth: fullScreen ? 0 : 1,
    borderTopRightRadius: fullScreen ? 0 : 8,
    borderTopLeftRadius: fullScreen ? 0 : 8,
    borderColor: '#319177',
    backgroundColor: '#319177',
  }),
  headerContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    borderWidth: 1.5,
    backgroundColor: '#319177',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    width: 30,
    height: 30,
    borderRadius: 8,
    borderColor: 'white',
  },
};
