//* KQScrollView.jsx
import React, {useState, useRef, useEffect} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';

const KQScrollView = ({children, style, noBar = false}) => {
  const [scrollBarHeight, setScrollBarHeight] = useState(0);
  const [scrollBarTop, setScrollBarTop] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const scrollViewRef = useRef();

  useEffect(() => {
    if (layoutHeight > 0 && contentHeight > layoutHeight) {
      const visibleRatio = layoutHeight / contentHeight;
      const calculatedHeight = layoutHeight * visibleRatio;
      const minHeight = 30;
      setScrollBarHeight(Math.max(calculatedHeight, minHeight));
      setScrollBarTop(0);
    } else {
      setScrollBarHeight(0);
      setScrollBarTop(0);
    }
  }, [layoutHeight, contentHeight]);

  const handleLayout = event => {
    const {height} = event.nativeEvent.layout;
    setLayoutHeight(height);
  };

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
  };

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const scrollRatio =
      contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const calculatedTop =
      scrollRatio * (layoutMeasurement.height - scrollBarHeight);
    setScrollBarTop(calculatedTop);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        contentContainerStyle={noBar ? {flex: 1} : styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {scrollBarHeight > 0 && (
        <View style={styles.scrollBar}>
          <View
            style={[
              styles.scrollBarThumb,
              {
                height: scrollBarHeight,
                top: scrollBarTop,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 3,
    paddingHorizontal: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  scrollBar: {
    position: 'absolute',
    right: 2,
    top: 2,
    bottom: 2,
    width: 4,
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  scrollBarThumb: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#373d4380',
    borderRadius: 3,
  },
});

export default KQScrollView;
