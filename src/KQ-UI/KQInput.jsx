//* KQInput.jsx
import React, {useMemo} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Text} from '../KQ-UI/';
import {useColors, useFontStyles} from './KQUtilities';

const Input = ({
  label = '',
  labelStyles = {},
  required = false,
  validation = false,
  validationMessage = '',
  value = '',
  onChangeText = () => {},
  capitalize = false,
  capitalMode = 'none',
  multiline = false,
  multiHeight = 'medium',
  scrollEnabled = true,
  fullBorder = false,
  caption = '',
  accessoryRight = null,
  counter = false,
  maxCount = 250,
  ...props
}) => {
  const fontStyles = useFontStyles('open-4', 'small', 'black');
  const showCount = value?.length || 0;
  const maxCountColor = useColors(showCount > maxCount ? 'danger' : 'dark90');

  const multiMode = useMemo(() => {
    if (!multiline) return {};

    const heightMap = {
      small: {minHeight: 25, maxHeight: 40},
      medium: {minHeight: 25, maxHeight: 75},
      large: {minHeight: 25, maxHeight: 150},
      xLarge: {minHeight: 25, maxHeight: 250},
      full: {minHeight: 25},
    };

    return {...(heightMap[multiHeight] || heightMap.medium)};
  }, [multiline, multiHeight]);

  const capMode = useMemo(
    () => (multiline ? 'sentences' : capitalize ? capitalMode : 'none'),
    [capitalize, capitalMode, multiline],
  );

  const InputInfoContainer = ({children}) => {
    if (caption || counter) {
      return (
        <View
          style={{
            flexDirection: 'row',
          }}>
          {children}
        </View>
      );
    }
    return null;
  };

  const handleTextChange = text => {
    if (text.length > maxCount) {
      text = text.substring(0, maxCount); // Trim excess characters
    }
    onChangeText(text); // Update state
  };

  return (
    <View style={styles.inputContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            size="medium"
            font="open-6"
            style={[
              styles.label(validation, props.disabled, fullBorder),
              labelStyles,
            ]}>
            {label} {required && '*'}
          </Text>
        </View>
      )}
      <View style={styles.inputWrapper}>
        <View style={styles.textInputContainer}>
          <TextInput
            value={value}
            onChangeText={handleTextChange}
            autoCapitalize={capMode}
            multiline={multiline}
            style={[fontStyles, multiMode, {padding: 0}]}
            {...props}
          />
        </View>
        {accessoryRight && (
          <View style={styles.accessoriesContainer}>{accessoryRight()}</View>
        )}
      </View>
      <InputInfoContainer>
        {caption && (
          <View style={{flex: 1}}>
            <Text
              size="xSmall"
              kqColor="dark90"
              font="open-5"
              numberOfLines={1}>
              ({caption})
            </Text>
          </View>
        )}
        {counter && (
          <View style={{flex: caption ? 0 : 1, alignItems: 'flex-end'}}>
            <Text
              size="xSmall"
              font="open-6"
              kqColor={maxCountColor}
              numberOfLines={1}>
              ({showCount} / {maxCount})
            </Text>
          </View>
        )}
      </InputInfoContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    paddingHorizontal: 2,
  },
  labelContainer: {position: 'relative', left: 2, marginBottom: 2},
  label: (validation, disabled) => ({
    color: validation ? '#fE4949' : disabled ? '#373d4390' : '#373d43',
  }),
  inputWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 2,
    paddingTop: 2,
    paddingBottom: 5,
  },
  accessoriesContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(Input);
