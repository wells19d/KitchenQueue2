import {useEffect, useRef, useState} from 'react';
import NavigationMode from 'react-native-navigation-mode';

// deviceUtils.js
export const hbDevices = [
  'iPhone SE',
  'iPad Air 3rd Gen (WiFi)',
  'iPad Air 3rd Gen (Cellular)',
  // Add other home-button models here as needed
];

export const isHBDevice = model => hbDevices.includes(model);

export const isAndroidPhone = device =>
  device?.system?.os === 'Android' && device?.system?.device === 'Handset';

export const isAndroidTablet = device =>
  device?.system?.os === 'Android' && device?.system?.device === 'Tablet';

export const isiOSPhone = device =>
  device?.system?.os === 'iOS' && device?.system?.device === 'Handset';

export const isiOSTablet = device =>
  device?.system?.os === 'iOS' && device?.system?.device === 'Tablet';

export const getNavMenuHeight = (device, mode) => {
  const hasButtons = mode?.type !== 'gesture';

  const {deviceSize, model, os} = device?.system || {};
  const isHomeButton = isHBDevice(model);

  let baseHeight = 90; // Fallback for unknown devices (just to be safe)

  switch (deviceSize) {
    case 'xLarge':
      baseHeight = 100;
      break;
    case 'large':
      baseHeight = 100;
      break;
    case 'medium':
      baseHeight = 100;
      break;
    case 'small':
      baseHeight = 100;
      break;
    case 'xSmall':
      baseHeight = 100;
      break;
    default:
      baseHeight = 90; // Unknown devices default to xSmall
      break;
  }

  // Special adjustment for iOS devices
  if (os === 'iOS') {
    baseHeight -= 5;
  }

  if (os === 'Android' && hasButtons) {
    baseHeight -= 30;
  }

  // Special adjustment for home button devices
  if (isHomeButton) {
    baseHeight -= 30;
  }

  return baseHeight;
};

export const getNavBarHeight = (device, baseHeight, navMode) => {
  const hasButtons = navMode?.type !== 'gesture';
  const {os} = device?.system || {};
  if (isHBDevice(device?.system?.model)) {
    return baseHeight;
  } else if (os === 'Android' && hasButtons) {
    return baseHeight;
  } else if (os === 'Android' && !hasButtons) {
    return baseHeight - 25;
  } else {
    return baseHeight - 20;
  }
};
