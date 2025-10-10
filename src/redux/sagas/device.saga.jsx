//* device.saga.jsx
import {put, takeLatest, call, take} from 'redux-saga/effects';
import {
  getBrand,
  getDeviceType,
  isLandscape,
  getModel,
  getSystemName,
  getSystemVersion,
  hasNotch,
} from 'react-native-device-info';
import {Dimensions} from 'react-native';
import {eventChannel} from 'redux-saga';

function createDimensionChannel() {
  return eventChannel(emitter => {
    const updateDimensions = () => emitter(Dimensions.get('window'));
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );
    return () => subscription?.remove();
  });
}

function* watchDeviceDimensions() {
  const channel = createDimensionChannel();
  try {
    while (true) {
      yield take(channel);
      yield call(fetchDeviceInfo);
    }
  } finally {
    channel.close();
  }
}

function* fetchDeviceInfo() {
  try {
    const {width, height} = Dimensions.get('window');
    const ratio = (Math.sqrt(width ** 2 + height ** 2) / 100).toFixed(1);

    const brand = yield call(getBrand);
    const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

    // device size category
    let sizeForDevice = 'xSmall';
    if (ratio >= 10.5) sizeForDevice = 'xLarge';
    else if (ratio >= 9.7) sizeForDevice = 'large';
    else if (ratio >= 9.4) sizeForDevice = 'medium';
    else if (ratio >= 9.0) sizeForDevice = 'small';

    // ✅ Each call individually resolved
    const deviceType = yield call(getDeviceType);
    const model = yield call(getModel);
    const os = yield call(getSystemName);
    const version = yield call(getSystemVersion);
    const notch = yield call(hasNotch);
    const landscape = yield call(isLandscape);

    const deviceInfo = {
      dimensions: {
        height: Number(height.toFixed(2)),
        width: Number(width.toFixed(2)),
        ratio: Number(ratio),
      },
      system: {
        brand: formattedBrand,
        device: deviceType,
        deviceSize: sizeForDevice,
        model,
        os,
        version,
        notch,
      },
      view: landscape ? 'Landscape' : 'Portrait',
    };

    console.log('device type', deviceInfo.system.device);

    yield put({type: 'SET_DEVICE_INFO', payload: deviceInfo});
  } catch (error) {
    yield put({type: 'DEVICE_INFO_FETCH_FAILED', payload: error.message});
  }
}

export default function* deviceSaga() {
  yield takeLatest('FETCH_DEVICE_INFO', fetchDeviceInfo);
  yield call(watchDeviceDimensions); // watches for dimension changes
}
