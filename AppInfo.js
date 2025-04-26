//* AppInfo.js
import version from './version.json';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

export const AppInfo = {
  appName: 'Kitchen Queue',
  appleAppVersion: version.appleAppVersion,
  androidAppVersion: version.androidAppVersion,
  appleBuildVersion: version.appleBuildVersion,
  googleBuildVersion: version.googleBuildVersion,
  tosVersion: version.tosVersion,
  ppVersion: version.ppVersion,
  deviceAppVersion: isIOS ? version.appleAppVersion : version.androidAppVersion,
  deviceBuildVersion: isAndroid
    ? version.appleBuildVersion
    : version.googleBuildVersion,
};

// Build Versions: Apple and Google deployment version
// MAJOR.MINOR.PATCH
// MAJOR: Incremented for incompatible API changes -- yarn bump-major
// MINOR: Incremented for new features -- yarn bump-minor
// PATCH: Incremented for bug fixes -- yarn bump-patch
// ALPHA: Pre-release version (Closed Invitation)
// BETA: Pre-release version (Open Invitation)
