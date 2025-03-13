import React from 'react';
import {
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
  children,
  onClose = () => {},
}) => {
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

  const modalSizes = {
    small: {
      top: centered
        ? deviceHeight / 2 - (deviceHeight * 0.3) / 2
        : insets.top + 10,
      bottom: centered
        ? deviceHeight / 2 - (deviceHeight * 0.3) / 2
        : deviceHeight * 0.75 - insets.top,
      left: centered
        ? deviceWidth / 2 - (deviceWidth * 0.825) / 2
        : insets.left + 35,
      right: centered
        ? deviceWidth / 2 - (deviceWidth * 0.825) / 2
        : insets.right + 35,
    },
    medium: {
      top: centered
        ? deviceHeight / 2 - (deviceHeight * 0.6) / 2
        : insets.top + 10,
      bottom: centered
        ? deviceHeight / 2 - (deviceHeight * 0.6) / 2
        : deviceHeight * 0.5 - insets.top,
      left: centered
        ? deviceWidth / 2 - (deviceWidth * 0.85) / 2
        : insets.left + 30,
      right: centered
        ? deviceWidth / 2 - (deviceWidth * 0.85) / 2
        : insets.right + 30,
    },
    large: {
      top: centered
        ? deviceHeight / 2 - (deviceHeight * 0.75) / 2
        : insets.top + 10,
      bottom: centered
        ? deviceHeight / 2 - (deviceHeight * 0.75) / 2
        : deviceHeight * 0.25 - insets.top,
      left: centered
        ? deviceWidth / 2 - (deviceWidth * 0.875) / 2
        : insets.left + 25,
      right: centered
        ? deviceWidth / 2 - (deviceWidth * 0.875) / 2
        : insets.right + 25,
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
      top: centered
        ? deviceHeight / 2 - (deviceHeight * convertedHeight * 0.85) / 2
        : insets.top + 10,
      bottom: centered
        ? deviceHeight / 2 - (deviceHeight * convertedHeight * 0.925) / 2
        : deviceHeight * (1 - convertedHeight) + insets.bottom,
      left: centered
        ? Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2)
        : Math.max(5, (deviceWidth * (1 - convertedWidth)) / 2 + insets.left),
      right: centered
        ? Math.max(5, deviceWidth / 2 - (deviceWidth * convertedWidth) / 2)
        : Math.max(5, (deviceWidth * (1 - convertedWidth)) / 2 + insets.right),
    },
  };

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback
      onPress={size !== 'covered' ? handleCloseButton : undefined}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
          <View style={[styles.modalContainer, modalSizes[size]]}>
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
          </View>
        </TouchableWithoutFeedback>
      </View>
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
