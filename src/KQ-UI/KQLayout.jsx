//* KQLayout.jsx
import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import NavHeader from '../components/NavHeader';
import KQScrollView from './KQScrollView';

const KQLayout = ({
  children,
  bgColor = '#ffffff',
  headerTitle = '',
  headerColor = '#319177',
  textColor = '#ffffff',
  LeftButton = '',
  RightButton = '',
  LeftAction = null,
  RightAction = null,
  sheetOpen = false,
  useHeader = true,
  useKeyboardHandling = false,
  useScrolling = false,
  innerViewStyles = {},
  outerViewStyles = {},
  noBar = false,
}) => {
  if (useKeyboardHandling) {
    return (
      <View
        style={[
          {flex: 1, backgroundColor: bgColor, paddingBottom: 25},
          outerViewStyles,
        ]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{flex: 1}}>
            {useHeader && (
              <NavHeader
                title={headerTitle}
                headerColor={headerColor}
                textColor={textColor}
                LeftButton={LeftButton}
                RightButton={RightButton}
                LeftAction={LeftAction}
                RightAction={RightAction}
                sheetOpen={sheetOpen}
              />
            )}
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
              <ScrollView
                onScrollBeginDrag={Keyboard.dismiss}
                contentContainerStyle={{flexGrow: 1}}>
                <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else if (useScrolling) {
    return (
      <View
        style={[
          {flex: 1, backgroundColor: bgColor, paddingBottom: 25},
          outerViewStyles,
        ]}>
        {useHeader && (
          <NavHeader
            title={headerTitle}
            headerColor={headerColor}
            textColor={textColor}
            LeftButton={LeftButton}
            RightButton={RightButton}
            LeftAction={LeftAction}
            RightAction={RightAction}
            sheetOpen={sheetOpen}
          />
        )}
        <KQScrollView noBar={noBar}>
          <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
        </KQScrollView>
      </View>
    );
  } else {
    return (
      <View
        style={[
          {flex: 1, backgroundColor: bgColor, paddingBottom: 25},
          outerViewStyles,
        ]}>
        {useHeader && (
          <NavHeader
            title={headerTitle}
            headerColor={headerColor}
            textColor={textColor}
            LeftButton={LeftButton}
            RightButton={RightButton}
            LeftAction={LeftAction}
            RightAction={RightAction}
            sheetOpen={sheetOpen}
          />
        )}
        <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
      </View>
    );
  }
};

export default KQLayout;
