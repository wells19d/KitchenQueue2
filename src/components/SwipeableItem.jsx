//* SwipeableItem.jsx
import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useEffect, useRef} from 'react';
import FlashShoppingCell from './FlashShoppingCell';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {setHapticFeedback} from '../hooks/setHapticFeedback';
import {ListStyles} from '../styles/Styles';
import {Animated, TouchableOpacity, View} from 'react-native';
import {Text} from '../KQ-UI';

const SwipeableItem = props => {
  const {
    list,
    profile,
    showItemInfo,
    setSelectedItem,
    setShowItemInfo,
    leftButtons = [],
    rightButtons = [],
  } = props;

  const swipeableRefs = useRef(new Map());
  const currentlyOpenRef = useRef(null);
  const useHaptics = setHapticFeedback();

  const closeSwipeable = itemId => {
    const swipeableRef = swipeableRefs.current.get(itemId);
    if (swipeableRef) {
      swipeableRef.close();
    }
  };

  const handleSwipeableOpen = itemId => {
    if (currentlyOpenRef.current && currentlyOpenRef.current !== itemId) {
      closeSwipeable(currentlyOpenRef.current);
    }
    currentlyOpenRef.current = itemId;
  };

  useEffect(() => {
    if (showItemInfo && currentlyOpenRef.current) {
      const ref = swipeableRefs.current.get(currentlyOpenRef.current);
      if (ref) {
        ref.close();
        currentlyOpenRef.current = null;
      }
    }
  }, [showItemInfo]);

  useEffect(() => {
    return () => {
      swipeableRefs.current.clear();
      currentlyOpenRef.current = null;
    };
  }, []);

  const closeAllSwipeables = () => {
    swipeableRefs.current.forEach(ref => {
      if (ref && typeof ref.close === 'function') {
        ref.close();
      }
    });
    currentlyOpenRef.current = null;
  };

  const renderRightActions = itemId => {
    if (rightButtons.length === 0) return null;

    return (
      <View style={ListStyles.actionsContainer}>
        {rightButtons.map((button, index) => (
          <Animated.View
            key={index}
            style={[ListStyles.actionButton, button.style]}>
            <TouchableOpacity
              onPress={() => {
                button.action(itemId);
                closeSwipeable(itemId);
                useHaptics(profile?.userSettings?.hapticStrength || 'light');
              }}>
              <View style={ListStyles.buttonContainer}>
                <Text size="xSmall" font="open-7" kqColor="white">
                  {button.text1}
                </Text>
                {button.text2 && (
                  <Text size="xSmall" font="open-7" kqColor="white">
                    {button.text2}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderLeftActions = itemId => {
    if (leftButtons.length === 0) return null;

    return (
      <View style={ListStyles.actionsContainer}>
        {leftButtons.map((button, index) => (
          <Animated.View
            key={index}
            style={[ListStyles.actionButton, button.style]}>
            <TouchableOpacity
              onPress={() => {
                button.action(itemId);
                closeSwipeable(itemId);
                useHaptics(profile?.userSettings?.hapticStrength || 'light');
              }}>
              <View style={ListStyles.buttonContainer}>
                <Text size="xSmall" font="open-7" kqColor="white">
                  {button.text1}
                </Text>
                {button.text2 && (
                  <Text size="xSmall" font="open-7" kqColor="white">
                    {button.text2}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderSwipeableItem = useCallback(
    ({item}) => (
      <Swipeable
        ref={ref => swipeableRefs.current.set(item.itemId, ref)}
        onSwipeableOpen={() => handleSwipeableOpen(item.itemId)}
        renderRightActions={() => renderRightActions(item.itemId)}
        renderLeftActions={() => renderLeftActions(item.itemId)}
        rightThreshold={200}
        leftThreshold={200}
        friction={1}
        overshootFriction={8}>
        <FlashShoppingCell
          item={item}
          profile={profile}
          setSelectedItem={setSelectedItem}
          setShowItemInfo={setShowItemInfo}
          showItemInfo={showItemInfo}
          closeAllSwipeables={closeAllSwipeables}
        />
      </Swipeable>
    ),
    [profile, setSelectedItem, setShowItemInfo],
  );

  return (
    <FlashList
      data={list}
      renderItem={renderSwipeableItem}
      keyExtractor={item => item.itemId}
      estimatedItemSize={70}
    />
  );
};

export default SwipeableItem;
