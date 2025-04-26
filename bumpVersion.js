const fs = require('fs');
const path = require('path');

// --- Helpers ---

function bumpVersion(version, type = 'patch') {
  const [major, minor, patchWithTag] = version.split('.');
  const patch = patchWithTag.split('-')[0];
  const tag = patchWithTag.includes('-')
    ? '-' + patchWithTag.split('-')[1]
    : '';

  let newMajor = parseInt(major, 10);
  let newMinor = parseInt(minor, 10);
  let newPatch = parseInt(patch, 10);

  if (type === 'major') {
    newMajor++;
    newMinor = 0;
    newPatch = 0;
  } else if (type === 'minor') {
    newMinor++;
    newPatch = 0;
  } else {
    newPatch++;
  }

  return `${newMajor}.${newMinor}.${newPatch}${tag}`;
}

function syncNative(versionData) {
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

  infoPlist = infoPlist.replace(
    /<key>CFBundleVersion<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleVersion</key>\n\t<string>${versionData.appleBuildVersion}</string>`,
  );

  infoPlist = infoPlist.replace(
    /<key>CFBundleShortVersionString<\/key>\s*<string>.*?<\/string>/,
    `<key>CFBundleShortVersionString</key>\n\t<string>${versionData.appleAppVersion}</string>`,
  );

  fs.writeFileSync(infoPlistPath, infoPlist, 'utf8');
  console.log('✅ Updated Info.plist');

  // --- Update build.gradle ---
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

  buildGradle = buildGradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${versionData.googleBuildVersion}`,
  );

  buildGradle = buildGradle.replace(
    /versionName\s+["'][^"']*["']/,
    `versionName "${versionData.androidAppVersion}"`,
  );

  fs.writeFileSync(buildGradlePath, buildGradle, 'utf8');
  console.log('✅ Updated build.gradle');
}

// --- Main Execution ---

const bumpTarget = process.argv[2]; // apple, android, global
const bumpType = process.argv[3] || 'patch'; // patch, minor, major

const validTargets = ['apple', 'android', 'global'];
const validTypes = ['patch', 'minor', 'major'];

if (!validTargets.includes(bumpTarget) || !validTypes.includes(bumpType)) {
  console.error(
    `Usage: node bumpVersion.js [apple|android|global] [patch|minor|major]`,
  );
  process.exit(1);
}

// Load version.json
const versionPath = path.resolve(__dirname, 'version.json');
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

// Bump selected
if (bumpTarget === 'apple') {
  const oldVersion = versionData.appleAppVersion;
  versionData.appleAppVersion = bumpVersion(oldVersion, bumpType);
  versionData.appleBuildVersion++;
  console.log(
    `✅ Bumped Apple: ${oldVersion} → ${versionData.appleAppVersion}`,
  );
} else if (bumpTarget === 'android') {
  const oldVersion = versionData.androidAppVersion;
  versionData.androidAppVersion = bumpVersion(oldVersion, bumpType);
  versionData.googleBuildVersion++;
  console.log(
    `✅ Bumped Android: ${oldVersion} → ${versionData.androidAppVersion}`,
  );
} else if (bumpTarget === 'global') {
  const oldApple = versionData.appleAppVersion;
  const oldAndroid = versionData.androidAppVersion;
  versionData.appleAppVersion = bumpVersion(oldApple, bumpType);
  versionData.androidAppVersion = bumpVersion(oldAndroid, bumpType);
  versionData.appleBuildVersion++;
  versionData.googleBuildVersion++;
  console.log(`✅ Bumped BOTH:`);
  console.log(`Apple: ${oldApple} → ${versionData.appleAppVersion}`);
  console.log(`Android: ${oldAndroid} → ${versionData.androidAppVersion}`);
}

// Save updated version.json
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2), 'utf8');
console.log('✅ Saved version.json');

// Sync to native files
syncNative(versionData);

// Done
console.log('✅ Finished bump + sync!');
