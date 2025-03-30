//* KQDropdown.jsx

import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {Modal, Text, ScrollView} from '../KQ-UI/';
import {Icons} from '../components/IconListRouter';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {useProfile} from '../hooks/useHooks';

const KQDropdown = ({
  label = '',
  labelStyles = {},
  required = false,
  validation = false,
  validationMessage = '',
  value = null,
  setValue = () => {},
  placeholder = '',
  onPress = () => {},
  caption,
  hapticFeedback = 'light',
  mapData,
  ...props
}) => {
  const isIOS = Platform.OS === 'ios';
  const useHaptics = setHapticFeedback();
  const profile = useProfile();
  const [showDropModal, setShowDropModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOnPress = () => {
    useHaptics(profile?.userSettings?.hapticStrength || hapticFeedback);
    setSelectedItem(value); // set to current value on open
    setShowDropModal(true);
    onPress();
  };

  const renderStyles = useMemo(() => {
    if (isIOS && value === null) {
      return {
        color: '#373d4350',
        padding: 0,
      };
    }

    if (!isIOS && value === null) {
      return {
        color: '#373d43',
        padding: 0,
        opacity: 0.8,
      };
    }
  }, [value, placeholder]);

  const handleCancel = () => {
    setShowDropModal(false);
    setSelectedItem(null);
  };

  const handleSave = item => {
    setShowDropModal(false);
    setValue(item);
  };

  const handleClear = () => {
    setSelectedItem(null);
    setValue(null);
  };

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
      <View style={styles.dropWrapper}>
        <TouchableOpacity onPress={() => handleOnPress()} style={{flex: 1}}>
          <Text style={renderStyles}>{value?.label || placeholder}</Text>
        </TouchableOpacity>

        {value && (
          <TouchableOpacity
            onPress={() => handleClear()}
            style={{paddingHorizontal: 5}}>
            <Icons.Close />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => handleOnPress()}
          style={{paddingHorizontal: 5}}>
          <Icons.ChevronDown />
        </TouchableOpacity>
      </View>
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
        fullScreen
        hideHeader
        onClose={() => setShowDropModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.headerButtonContainer}
              onPress={handleCancel}>
              <View style={styles.headerButtonIcon}>
                <View style={{position: 'relative', left: 4}}>
                  <Icons.Back />
                </View>
              </View>
              <View style={styles.headerButtonTextLeft}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButtonContainer}
              onPress={() => handleSave(selectedItem)}>
              <View style={styles.headerButtonTextRight}>
                <Text>Save</Text>
              </View>
              <View style={styles.headerButtonIcon}>
                <Icons.Save />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <ScrollView>
              <View style={{flex: 1}}>
                {mapData?.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{borderBottomWidth: 1, borderColor: '#373d4380'}}>
                      <TouchableOpacity
                        style={{
                          height: 48,
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          paddingHorizontal: 5,
                        }}
                        onPress={() => setSelectedItem(item)}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 1}}>
                            <Text
                              size={
                                selectedItem?.index === item.index
                                  ? 'small'
                                  : 'xSmall'
                              }
                              font={
                                selectedItem?.index === item.index
                                  ? 'open-7'
                                  : 'open-5'
                              }>
                              {item.label}
                            </Text>
                          </View>
                          {selectedItem?.index === item.index && (
                            <View>
                              <Icons.Check color={'#63B76C'} size={20} />
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
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
    paddingTop: 2,
    paddingBottom: 4,
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
  modalContainer: {flex: 1, flexDirection: 'column'},
  headerContainer: {
    height: 50,
    marginHorizontal: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  headerButtonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerButtonIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonTextLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  headerButtonTextRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
};

export default __DEV__ ? KQDropdown : React.memo(KQDropdown);
