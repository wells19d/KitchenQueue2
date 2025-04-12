//* KQUtilities.jsx
import {Platform} from 'react-native';

export const useColors = color => {
  if (!color || typeof color !== 'string') return '#000000'; // Default to black

  const colors = {
    black: '#000000',
    white: '#ffffff',
    primary: '#319177',
    success: '#63B76C',
    info: '#009DC4',
    warning: '#FCC945',
    danger: '#DA2C43',
    dark: '#373d43',
    dark90: '#373d43E6',
    dark80: '#373d43CC',
    dark70: '#373d43B3',
    dark60: '#373d4399',
    dark50: '#373d4380',
    dark40: '#373d4366',
    dark30: '#373d434D',
    dark20: '#373d4333',
    dark10: '#373d431A',
    basic: '#C4C4C4',
  };

  const normalizedColor = color.trim().toLowerCase();

  // If it's a predefined color, return it
  if (colors[normalizedColor]) {
    return colors[normalizedColor];
  }

  // If it's a valid hex or RGB(A) color, return it as is
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color) || color.startsWith('rgb')) {
    return color;
  }

  return '#000000'; // Default fallback
};

const fontLookup = {
  // NotoSans mappings
  'noto-1': {ios: 'NotoSans', android: 'NotoSans-Thin', weight: 100},
  'noto-2': {ios: 'NotoSans', android: 'NotoSans-ExtraLight', weight: 200},
  'noto-3': {ios: 'NotoSans', android: 'NotoSans-Light', weight: 300},
  'noto-4': {ios: 'NotoSans', android: 'NotoSans-Regular', weight: 400},
  'noto-5': {ios: 'NotoSans', android: 'NotoSans-Medium', weight: 500},
  'noto-6': {ios: 'NotoSans', android: 'NotoSans-SemiBold', weight: 600},
  'noto-7': {ios: 'NotoSans', android: 'NotoSans-Bold', weight: 700},
  'noto-8': {ios: 'NotoSans', android: 'NotoSans-ExtraBold', weight: 800},
  'noto-9': {ios: 'NotoSans', android: 'NotoSans-Black', weight: 900},

  // Montserrat mappings
  'mont-1': {ios: 'Montserrat', android: 'Montserrat-Thin', weight: 100},
  'mont-2': {ios: 'Montserrat', android: 'Montserrat-ExtraLight', weight: 200},
  'mont-3': {ios: 'Montserrat', android: 'Montserrat-Light', weight: 300},
  'mont-4': {ios: 'Montserrat', android: 'Montserrat-Regular', weight: 400},
  'mont-5': {ios: 'Montserrat', android: 'Montserrat-Medium', weight: 500},
  'mont-6': {ios: 'Montserrat', android: 'Montserrat-SemiBold', weight: 600},
  'mont-7': {ios: 'Montserrat', android: 'Montserrat-Bold', weight: 700},
  'mont-8': {ios: 'Montserrat', android: 'Montserrat-ExtraBold', weight: 800},
  'mont-9': {ios: 'Montserrat', android: 'Montserrat-Black', weight: 900},

  // OpenSans mappings
  'open-3': {ios: 'OpenSans-Light', android: 'OpenSans-Light', weight: 300},
  'open-4': {ios: 'OpenSans-Regular', android: 'OpenSans-Regular', weight: 400},
  'open-5': {ios: 'OpenSans-Medium', android: 'OpenSans-Medium', weight: 500}, // Default
  'open-6': {
    ios: 'OpenSans-SemiBold',
    android: 'OpenSans-SemiBold',
    weight: 600,
  },
  'open-7': {ios: 'OpenSans-Bold', android: 'OpenSans-Bold', weight: 700},
  'open-8': {
    ios: 'OpenSans-ExtraBold',
    android: 'OpenSans-ExtraBold',
    weight: 800,
  },

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
const DEFAULT_FONT = 'open-5';

export const useFonts = (font = DEFAULT_FONT) => {
  const normalizedFont = font.trim().toLowerCase();
  const fontData = fontLookup[normalizedFont] || fontLookup[DEFAULT_FONT];

  return Platform.OS === 'ios'
    ? {fontFamily: fontData.ios, fontWeight: fontData.weight}
    : {fontFamily: fontData.android};
};

export const useFontSizes = (size = 'medium', font = 'OpenSans') => {
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

export const useFontStyles = (
  font = 'open-5',
  size = 'medium',
  color = 'black',
) => {
  return {
    ...useFonts(font), // ✅ Returns { fontFamily, fontWeight }
    ...useFontSizes(size, font), // ✅ Returns { fontSize }
    color: useColors(color), // ✅ Assign color as a string
  };
};

export const useButtonStyles = (type = 'filled', color = 'primary') => {
  const statusColor = useColors(color);

  const styles = {
    filled: {
      backgroundColor: statusColor,
      elevation: 4,
      shadowColor: '#373d43',
      shadowOffset: {width: 2, height: 3},
      shadowOpacity: 0.3,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: statusColor,
      borderWidth: 2,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return styles[type] || styles.filled;
};

export const useButtonSizes = (size = 'medium') => {
  const sizes = {
    tiny: 30,
    small: 35,
    medium: 40,
    large: 50,
    giant: 60,
  };

  return {
    height: sizes[size] ?? sizes.medium,
    paddingHorizontal: 12,
  };
};
