const fs = require('fs');
const path = require('path');

// Load version.json
const versionPath = path.resolve(__dirname, 'version.json');
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

// Paths to native files
const infoPlistPath = path.resolve(
  __dirname,
  'ios',
  'KitchenQueue',
  'Info.plist',
);
const buildGradlePath = path.resolve(
  __dirname,
  'android',
  'app',
  'build.gradle',
);

// --- Update Info.plist ---
let infoPlist = fs.readFileSync(infoPlistPath, 'utf8');

// Replace CFBundleVersion
infoPlist = infoPlist.replace(
  /<key>CFBundleVersion<\/key>\s*<string>.*?<\/string>/,
  `<key>CFBundleVersion</key>\n\t<string>${versionData.appleBuildVersion}</string>`,
);

// Replace CFBundleShortVersionString
infoPlist = infoPlist.replace(
  /<key>CFBundleShortVersionString<\/key>\s*<string>.*?<\/string>/,
  `<key>CFBundleShortVersionString</key>\n\t<string>${versionData.appleAppVersion}</string>`,
);

// Write back Info.plist
fs.writeFileSync(infoPlistPath, infoPlist, 'utf8');

// --- Update build.gradle ---
let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

// Replace versionCode
buildGradle = buildGradle.replace(
  /versionCode\s+\d+/,
  `versionCode ${versionData.googleBuildVersion}`,
);

// Replace versionName
buildGradle = buildGradle.replace(
  /versionName\s+["'][^"']*["']/,
  `versionName "${versionData.androidAppVersion}"`,
);

// Write back build.gradle
fs.writeFileSync(buildGradlePath, buildGradle, 'utf8');
