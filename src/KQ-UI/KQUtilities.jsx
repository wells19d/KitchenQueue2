//* KQUtilities.js
import {Platform} from 'react-native';

export const useColors = color => {
  if (!color || typeof color !== 'string') return {color: '#000000'};

  const colors = {
    black: '#000000',
    white: '#ffffff',
    primary: '#319177',
    success: '#63B76C',
    info: '#009DC4',
    warning: '#FCC945',
    danger: '#DA2C43',
    dark: '#373d43',
    basic: '#C4C4C4',
  };

  const normalizedColor = color.trim().toLowerCase();

  return {
    color:
      colors[normalizedColor] ||
      (/^#([0-9A-F]{3}){1,2}$/i.test(color) || color.includes('rgb')
        ? color
        : colors.black),
  };
};

const fontLookup = {
  // NotoSans mappings
  'noto-1': {ios: 'NotoSans', android: 'NotoSans-Thin', weight: 100},
  'noto-2': {ios: 'NotoSans', android: 'NotoSans-ExtraLight', weight: 200},
  'noto-3': {ios: 'NotoSans', android: 'NotoSans-Light', weight: 300},
  'noto-4': {ios: 'NotoSans', android: 'NotoSans-Regular', weight: 400},
  'noto-5': {ios: 'NotoSans', android: 'NotoSans-Medium', weight: 500}, // Default
  'noto-6': {ios: 'NotoSans', android: 'NotoSans-SemiBold', weight: 600},
  'noto-7': {ios: 'NotoSans', android: 'NotoSans-Bold', weight: 700},
  'noto-8': {ios: 'NotoSans', android: 'NotoSans-ExtraBold', weight: 800},
  'noto-9': {ios: 'NotoSans', android: 'NotoSans-Black', weight: 900},

  // Montserrat mappings
  'mont-1': {ios: 'Montserrat', android: 'Montserrat-Thin', weight: 100},
  'mont-2': {ios: 'Montserrat', android: 'Montserrat-ExtraLight', weight: 200},
  'mont-3': {ios: 'Montserrat', android: 'Montserrat-Light', weight: 300},
  'mont-4': {ios: 'Montserrat', android: 'Montserrat-Regular', weight: 400},
  'mont-5': {ios: 'Montserrat', android: 'Montserrat-Medium', weight: 500}, // Default
  'mont-6': {ios: 'Montserrat', android: 'Montserrat-SemiBold', weight: 600},
  'mont-7': {ios: 'Montserrat', android: 'Montserrat-Bold', weight: 700},
  'mont-8': {ios: 'Montserrat', android: 'Montserrat-ExtraBold', weight: 800},
  'mont-9': {ios: 'Montserrat', android: 'Montserrat-Black', weight: 900},

  // Special cases (no weight variations)
  cherry: {
    ios: 'CherryBlossom',
    android: 'Cherry-Blossom',
    weight: 500,
  },
  banana: {
    ios: 'BananaChips-Regular',
    android: 'BananaChips-Regular',
    weight: 500,
    lineHeightFactor: 0.8, // Adjusts large vertical space
  },
};

// Default settings
const DEFAULT_FONT = 'noto-5';

export const useFonts = (font = DEFAULT_FONT) => {
  const normalizedFont = font.trim().toLowerCase();
  const fontData = fontLookup[normalizedFont] || fontLookup[DEFAULT_FONT];

  return Platform.OS === 'ios'
    ? {fontFamily: fontData.ios, fontWeight: fontData.weight}
    : {fontFamily: fontData.android};
};

export const useSizes = (size = 'medium', font = 'NotoSans') => {
  const sizes = {
    tiny: 12,
    xSmall: 14,
    small: 16,
    medium: 18, // Default
    large: 20,
    xLarge: 24,
    giant: 28,
    massive: 36,
    gargantuan: 48,
  };

  // Scaling factors based on font
  const fontScale = {
    cherry: 1.1, // Slightly larger
    banana: 2, // Twice the size
  };

  const baseSize = sizes[size] || sizes.medium;
  const scaleFactor = fontScale[font.toLowerCase()] || 1;
  return {fontSize: baseSize * scaleFactor};
};
