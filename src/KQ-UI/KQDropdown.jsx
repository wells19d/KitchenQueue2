//* KQDropdown.jsx

import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Modal, Text, Button} from '../KQ-UI/';
import {useFontStyles} from './KQUtilities';
import {Icons} from '../components/IconListRouter';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {useProfile} from '../hooks/useHooks';

const KQDropdown = ({
  label = '',
  labelStyles = {},
  required = false,
  validation = false,
  validationMessage = '',
  value = '',
  placeholder = '',
  onPress = () => {},
  caption,
  hapticFeedback = 'light',
  mapData,
  ...props
}) => {
  const useHaptics = setHapticFeedback();
  const profile = useProfile();
  const [showDropModal, setShowDropModal] = useState(false);
  const isIOS = Platform.OS === 'ios';

  const handleOnPress = () => {
    useHaptics(profile?.userSettings?.hapticStrength || hapticFeedback);
    setShowDropModal(prev => !prev);
    onPress();
  };

  const renderStyles = useMemo(() => {
    if (isIOS && value === '') {
      return {
        color: '#373d4350',
        padding: 0,
      };
    }

    if (!isIOS && value === '') {
      return {
        color: '#373d43',
        padding: 0,
        opacity: 0.8,
      };
    }
  }, [value, placeholder]);

  return (
    <View style={styles.dropContainer}>
      {label && (
        <View style={styles.labelContainer}>
          <View style={styles.labelContainer}>
            <Text
              size="small"
              font="open-6"
              style={[styles.label(validation, props.disabled), labelStyles]}>
              {label} {required && '*'}
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity onPress={handleOnPress} style={styles.dropWrapper}>
        <View style={styles.textInputContainer}>
          <Text size="small" font="open-6" style={renderStyles}>
            {value ? value : placeholder}
          </Text>
        </View>
        <View style={styles.accessoriesContainer}>
          <Icons.ChevronDown />
        </View>
      </TouchableOpacity>
      {caption && (
        <View style={styles.captionContainer}>
          <View style={{flex: 1}}>
            <Text
              size="xSmall"
              kqColor="dark90"
              font="open-5"
              numberOfLines={1}>
              ({caption})
            </Text>
          </View>
        </View>
      )}
      <Modal
        visible={showDropModal}
        header="Full Screen"
        headerFont="open-6"
        headerSize="small"
        headerColor="white"
        height="95%"
        width="95%"
        fullScreen
        hideHeader
        // hideTitle
        // hideClose
        onClose={() => setShowDropModal(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Drop Down Modal</Text>
          <Button onPress={() => setShowDropModal(false)}>Close Modal</Button>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  dropContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    paddingHorizontal: 2,
  },
  labelContainer: {position: 'relative', left: 0},
  label: (validation, disabled) => ({
    color: validation ? '#fE4949' : disabled ? '#373d4390' : '#373d43',
  }),
  dropWrapper: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
  },
  captionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 1,
    paddingVertical: 3,
  },
  accessoriesContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default React.memo(KQDropdown);
