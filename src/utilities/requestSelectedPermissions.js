export async function requestSelectedPermissions({
  notifications,
  camera,
  storage,
}) {
  const asked = [];

  if (Platform.OS === 'android') {
    const api = Number(Platform.Version);
    const perms = [];

    if (notifications && api >= 33)
      perms.push(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (camera) perms.push(PERMISSIONS.ANDROID.CAMERA);

    if (storage) {
      if (api >= 33) {
        perms.push(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
        // If you ever support video/audio picks, also push:
        // PERMISSIONS.ANDROID.READ_MEDIA_VIDEO, PERMISSIONS.ANDROID.READ_MEDIA_AUDIO
      } else {
        perms.push(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        if (api <= 28) perms.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      }
    }

    const clean = perms.filter(Boolean);
    if (clean.length) {
      const res = await requestMultiple(clean);
      clean.forEach(p => {
        const key =
          p === PERMISSIONS.ANDROID.POST_NOTIFICATIONS
            ? 'notifications'
            : p === PERMISSIONS.ANDROID.CAMERA
            ? 'camera'
            : p === PERMISSIONS.ANDROID.READ_MEDIA_IMAGES ||
              p === PERMISSIONS.ANDROID.READ_MEDIA_VIDEO ||
              p === PERMISSIONS.ANDROID.READ_MEDIA_AUDIO ||
              p === PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE ||
              p === PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
            ? 'storage'
            : p;

        asked.push([key, res[p]]);
      });
    }
  }

  const ok = s => s === RESULTS.GRANTED || s === RESULTS.LIMITED;
  const allGranted = asked.length > 0 && asked.every(([, s]) => ok(s));
  const blocked = asked
    .filter(([, s]) => s === RESULTS.BLOCKED)
    .map(([k]) => k);

  if (blocked.length) {
    Alert.alert(
      'Permission blocked',
      `These are blocked in system settings: ${blocked.join(', ')}.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: openSettings},
      ],
    );
  }

  return {allGranted, asked, blocked, anyRequested: asked.length > 0};
}
