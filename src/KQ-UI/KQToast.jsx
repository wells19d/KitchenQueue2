//*KQToast.jsx
import {BaseToast} from 'react-native-toast-message';

const toastStyles = {
  baseStyle: {
    top: 60,
    minHeight: 75,
    paddingVertical: 20,
  },
  primary: {borderLeftColor: '#44B3B3'},
  success: {borderLeftColor: '#228B22'},
  info: {borderLeftColor: '#0077A2'},
  warning: {borderLeftColor: '#FCC945'},
  danger: {borderLeftColor: '#fE4949'},
  dark: {borderLeftColor: '#373d43'},
  basic: {borderLeftColor: '#C4C4C4'},
  textStyle1: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
  textStyle2: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
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
