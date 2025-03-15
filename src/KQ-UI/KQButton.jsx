//* KQButton.jsx
import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '../KQ-UI/';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {useProfile} from '../hooks/useHooks';
import {
  useColors,
  useFontStyles,
  useButtonStyles,
  useButtonSizes,
} from './KQUtilities';

const KQButton = ({
  children,
  onPress,
  style = {},
  textStyle = {},
  outerTextStyle = {},
  type = 'filled',
  size = 'small',
  color = 'primary',
  textSize = 'small',
  textColor = 'white',
  fontType = 'open-6',
  hapticFeedback = 'light',
  disabled = false,
  ...props
}) => {
  const useHaptics = setHapticFeedback();
  const profile = useProfile();
  const buttonColor = useColors(disabled ? 'basic' : color);
  const buttonStyle = useButtonStyles(type, buttonColor);
  const buttonSize = useButtonSizes(size);

  const fontStyles = useFontStyles(
    fontType,
    textSize,
    type === 'filled' ? textColor : buttonColor,
  );

  const handlePress = useCallback(() => {
    useHaptics(profile?.userSettings?.hapticStrength || hapticFeedback);
    if (onPress) onPress();
  }, [profile?.userSettings?.hapticStrength, hapticFeedback, onPress]);

  return (
    <TouchableOpacity
      style={[ButtonStyles.buttonOC, buttonStyle, buttonSize, style]}
      onPress={!disabled ? handlePress : null}
      disabled={disabled}
      {...props}>
      <View style={outerTextStyle}>
        <Text
          numberOfLines={1}
          style={[ButtonStyles.buttonText, fontStyles, textStyle]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ButtonStyles = StyleSheet.create({
  buttonOC: {
    borderRadius: 5,
    margin: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default React.memo(KQButton);
