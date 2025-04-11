//* KQLayout.jsx
import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import NavHeader from '../components/NavHeader';
import KQScrollView from './KQScrollView';

const KQLayout = ({
  children,
  mode = '',
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
  innerViewStyles = {},
  outerViewStyles = {},
  noBar = false,
}) => {
  const baseStyle = {
    flex: 1,
    backgroundColor: bgColor,
    paddingBottom: 25,
  };

  const renderHeader = () =>
    useHeader && (
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
    );

  switch (mode) {
    case 'keyboard-scroll':
      return (
        <View style={[baseStyle, outerViewStyles]}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={{flex: 1}}>
              {renderHeader()}
              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
                <KQScrollView
                  noBar={noBar}
                  onScrollBeginDrag={Keyboard.dismiss}
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled">
                  <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
                </KQScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );

    case 'keyboard-static':
      return (
        <View style={[baseStyle, outerViewStyles]}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={{flex: 1}}>
              {renderHeader()}
              <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
                <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );

    case 'scroll-only':
      return (
        <View style={[baseStyle, outerViewStyles]}>
          {renderHeader()}
          <KQScrollView noBar={noBar}>
            <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
          </KQScrollView>
        </View>
      );

    default:
      return (
        <View style={[baseStyle, outerViewStyles]}>
          {renderHeader()}
          <View style={[{flex: 1}, innerViewStyles]}>{children}</View>
        </View>
      );
  }
};

export default KQLayout;
