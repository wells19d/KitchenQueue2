import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';
import {Text} from '../KQ-UI';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDeviceInfo, useProfile} from '../hooks/useHooks';
import {Icons} from '../components/IconListRouter';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {isHBDevice} from '../utilities/deviceUtils';

const KQModal = ({
  size = 'full',
  title = '',
  font = 'open-6',
  fontSize = 'medium',
  hapticFeedback = 'light',
  height = '90%',
  width = '90%',
  centered = false,
  visible = false,
  noTitle = false,
  noHeader = false,
  noCloseButton = false,
  globalView = false,
  children,
  onClose = () => {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const useHaptics = setHapticFeedback();
  const profile = useProfile();
  const insets = useSafeAreaInsets();
  const device = useDeviceInfo();
  const isHB = isHBDevice(device?.system?.model);
  const deviceWidth = device?.dimensions?.width || 300;
  const deviceHeight = device?.dimensions.height || 400;

  let convertedHeight = parseInt(height) / 100;
  let convertedWidth = parseInt(width) / 100;

  const handleCloseButton = () => {
    useHaptics(profile?.userSettings?.hapticStrength || hapticFeedback);
    onClose();
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const standardSizes = {
    small: {
      top: 10,
      bottom: deviceHeight * 0.65 - insets.top,
      left: 35,
      right: 35,
    },
    medium: {
      top: 10,
      bottom: deviceHeight * 0.4 - insets.top,
      left: 30,
      right: 30,
    },
    large: {
      top: 10,
      bottom: deviceHeight * 0.25 - insets.top,
      left: insets.left + 25,
      right: insets.right + 25,
    },
    full: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
    covered: {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
    },
    custom: {
      top: 10,
      bottom: Math.max(5, deviceHeight * (1 - convertedHeight) + 10),
      left: Math.max(5, (deviceWidth * (1 - convertedWidth)) / 2 + 10),
      right: Math.max(5, (deviceWidth * (1 - convertedWidth)) / 2 + 10),
    },
  };

  const centeredSizes = {
    small: {
      top: deviceHeight * 0.3,
      bottom: deviceHeight * 0.3,
      left: centered ? deviceWidth * 0.0875 : insets.left + 35,
      right: centered ? deviceWidth * 0.0875 : insets.right + 35,
    },
    medium: {
      top: centered ? deviceHeight * 0.2 : insets.top + 10,
      bottom: centered ? deviceHeight * 0.2 : deviceHeight * 0.5 - insets.top,
      left: centered ? deviceWidth * 0.075 : insets.left + 30,
      right: centered ? deviceWidth * 0.075 : insets.right + 30,
    },
    large: {
      top: centered ? deviceHeight * 0.125 : insets.top + 10,
      bottom: centered
        ? deviceHeight * 0.125
        : deviceHeight * 0.25 - insets.top,
      left: centered ? deviceWidth * 0.0625 : insets.left + 25,
      right: centered ? deviceWidth * 0.0625 : insets.right + 25,
    },
    full: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
    covered: {
      top: 2,
      bottom: 2,
      left: 2,
      right: 2,
    },
    custom: {
      top: deviceHeight / 2 - (deviceHeight * convertedHeight) / 2,
      bottom: deviceHeight / 2 - (deviceHeight * convertedHeight) / 2,
      left: Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2),
      right: Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2),
    },
  };

  const globalSizes = {
    small: {
      top: insets.top + 10,
      bottom: deviceHeight * 0.75 - insets.top,
      left: insets.left + 35,
      right: insets.right + 35,
    },
    medium: {
      top: insets.top + 10,
      bottom: deviceHeight * 0.5 - insets.top,
      left: insets.left + 30,
      right: insets.right + 30,
    },
    large: {
      top: insets.top + 10,
      bottom: deviceHeight * 0.25 - insets.top,
      left: insets.left + 25,
      right: insets.right + 25,
    },
    full: {
      top: insets.top + 10,
      bottom: deviceHeight * 0.1 - insets.top,
      left: insets.left + 20,
      right: insets.right + 20,
    },
    covered: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    custom: {
      top: insets.top + 10,
      bottom: deviceHeight * (1 - convertedHeight) + insets.bottom,
      left: Math.max(5, (deviceWidth * (1 - convertedWidth)) / 2 + insets.left),
      right: Math.max(
        5,
        (deviceWidth * (1 - convertedWidth)) / 2 + insets.right,
      ),
    },
  };

  const globalCenteredSizes = {
    small: {
      top: deviceHeight * 0.35,
      bottom: deviceHeight * 0.35,
      left: deviceWidth * 0.0875,
      right: deviceWidth * 0.0875,
    },
    medium: {
      top: deviceHeight * 0.2,
      bottom: deviceHeight * 0.2,
      left: deviceWidth * 0.075,
      right: deviceWidth * 0.075,
    },
    large: {
      top: deviceHeight * 0.125,
      bottom: deviceHeight * 0.125,
      left: deviceWidth * 0.0625,
      right: deviceWidth * 0.0625,
    },
    full: {
      top: insets.top + 10,
      bottom: deviceHeight * 0.1 - insets.top,
      left: insets.left + 20,
      right: insets.right + 20,
    },
    covered: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    custom: {
      top: deviceHeight / 2 - (deviceHeight * convertedHeight) / 2,
      bottom: deviceHeight / 2 - (deviceHeight * convertedHeight) / 2,
      left: Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2),
      right: Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2),
    },
  };

  const useSize = useMemo(() => {
    console.log(size, centered, globalView);
    if (!globalView && !centered) {
      return standardSizes[size];
    }
    if (!globalView && centered) {
      return centeredSizes[size];
    }
    if (globalView && !centered) {
      return globalSizes[size];
    }
    if (globalView && centered) {
      return globalCenteredSizes[size];
    }
  }, [centered, size, globalView, convertedHeight, convertedWidth]);

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback
      onPress={size !== 'covered' ? handleCloseButton : undefined}>
      <Animated.View
        style={[
          styles.backdrop,
          {bottom: globalView ? 0 : 25, opacity: fadeAnim},
        ]}>
        <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
          <Animated.View
            style={[styles.modalContainer, useSize, {opacity: fadeAnim}]}>
            {size !== 'covered' && !noHeader && (
              <View style={styles.header}>
                <View
                  style={[
                    styles.titleContainer,
                    noCloseButton && {marginRight: 0},
                  ]}>
                  {!noTitle && (
                    <Text size={fontSize} font={font} numberOfLines={1}>
                      {title}
                    </Text>
                  )}
                </View>
                {!noCloseButton && (
                  <TouchableOpacity
                    onPress={handleCloseButton}
                    style={styles.closeButton}>
                    <Icons.Close />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View
              style={[
                styles.childrenContainer,
                {
                  marginTop:
                    size === 'covered' ? insets.top : noHeader ? 0 : 10,
                  marginBottom:
                    size === 'covered' ? (isHB ? 0 : insets.bottom + 40) : 0,
                },
              ]}>
              {children}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(55, 61, 67, 0.6)',
    zIndex: 9000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    borderWidth: 0,
    borderColor: '#373d43',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.3,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 37,
    marginRight: -37,
    paddingRight: 42,
    paddingLeft: 5,
  },
  closeButton: {
    borderWidth: 2,
    borderColor: '#C4C4C4',
    borderRadius: 5,
    margin: 1,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childrenContainer: {
    flex: 1,
  },
});

export default KQModal;
