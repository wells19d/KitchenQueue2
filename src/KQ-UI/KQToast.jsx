//*KQToast.jsx
import {BaseToast} from 'react-native-toast-message';

const toastStyles = {
  baseStyle: {
    top: 60,
    minHeight: 75,
    paddingVertical: 10,
  },
  primary: {borderLeftColor: '#319177'},
  success: {borderLeftColor: '#63B76C'},
  info: {borderLeftColor: '#009DC4'},
  warning: {borderLeftColor: '#FCC945'},
  danger: {borderLeftColor: '#DA2C43'},
  dark: {borderLeftColor: '#373d43'},
  basic: {borderLeftColor: '#C4C4C4'},
  textStyle1: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'OpenSans-Bold',
    fontWeight: 700,
  },
  textStyle2: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: 600,
  },
};

const toastConfig = {
  primary: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.primary]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  success: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.success]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  info: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.info]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  warning: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.warning]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  danger: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.danger]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  dark: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.dark]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
  basic: props => (
    <BaseToast
      {...props}
      style={[toastStyles.baseStyle, toastStyles.basic]}
      text1Style={toastStyles.textStyle1}
      text2Style={toastStyles.textStyle2}
      text1NumberOfLines={2}
      text2NumberOfLines={3}
      topOffset={100}
    />
  ),
};

export default toastConfig;
