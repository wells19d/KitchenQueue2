# 🛠️ Kitchen Queue — Versioning System Documentation

---

## 📚 Overview

Kitchen Queue uses a **single-source version management system** to control:

- 📱 iOS App Version & Build
- 🬖 Android App Version & Build
- 🌎 Frontend Version Display (inside the app)
- 🚀 Native Platform Deployment Versions (Info.plist & build.gradle)

The **master control file** is:

```bash
version.json
```

This file should **NOT** be edited manually except in an emergency.

Version updates are handled through **automated Yarn scripts** that bump versions and sync native files automatically.

---

## ⚠️ WARNING: Do Not Edit `version.json` Directly!

**NEVER manually edit `version.json`** unless absolutely required (e.g., emergency recovery from a corrupted file or git revert).

- Always use the Yarn bump commands provided below.
- Direct manual edits can cause mismatches between your app frontend, iOS native files, and Android native files.
- If you must manually edit it, **immediately run**:

```bash
yarn sync-version
```

to reapply values to native files.

---

## 🧠 How Versioning Works

| Platform             | Field                      | Source                                 |
| :------------------- | :------------------------- | :------------------------------------- |
| iOS App Version      | CFBundleShortVersionString | `appleAppVersion` from version.json    |
| iOS Build Number     | CFBundleVersion            | `appleBuildVersion` from version.json  |
| Android App Version  | versionName                | `androidAppVersion` from version.json  |
| Android Build Number | versionCode                | `googleBuildVersion` from version.json |
| Frontend App Display | AppInfo.js                 | Pulled from `version.json` dynamically |

---

## 🚀 Bump Commands

All version updates are done using Yarn scripts.
Each command automatically:

- Bumps version numbers appropriately
- Updates `version.json`
- Syncs the new values into Info.plist (iOS) and build.gradle (Android)

---

### 📱 Apple-Only Version Bumping

| Action                            | Command              |
| :-------------------------------- | :------------------- |
| Bump Apple patch (0.9.0 → 0.9.1)  | `yarn apple-patch++` |
| Bump Apple minor (0.9.0 → 0.10.0) | `yarn apple-minor++` |
| Bump Apple major (0.9.0 → 1.0.0)  | `yarn apple-major++` |

---

### 🬖 Android-Only Version Bumping

| Action                              | Command                |
| :---------------------------------- | :--------------------- |
| Bump Android patch (0.9.0 → 0.9.1)  | `yarn android-patch++` |
| Bump Android minor (0.9.0 → 0.10.0) | `yarn android-minor++` |
| Bump Android major (0.9.0 → 1.0.0)  | `yarn android-major++` |

---

### 🌎 Global (Both Platforms Together)

| Action                            | Command               |
| :-------------------------------- | :-------------------- |
| Bump BOTH Apple and Android patch | `yarn global-patch++` |
| Bump BOTH Apple and Android minor | `yarn global-minor++` |
| Bump BOTH Apple and Android major | `yarn global-major++` |

---

## 🧹 Emergency Sync (Only if Needed)

If you manually touch `version.json` or recover from a corrupted project, you **must** manually sync the current version back into the native files by running:

```bash
yarn sync-version
```

Use this command cautiously. It is intended for emergency corrections only.
