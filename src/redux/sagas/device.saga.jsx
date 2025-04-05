//* device.saga.jsx
import {put, takeLatest, call, takeEvery} from 'redux-saga/effects';
import {
  getBrand,
  getDeviceType,
  isLandscape,
  getModel,
  getSystemName,
  getSystemVersion,
  hasNotch,
} from 'react-native-device-info';
import {Dimensions, PixelRatio} from 'react-native';
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
      yield takeEvery(channel, fetchDeviceInfo);
    }
  } finally {
    channel.close();
  }
}

function* fetchDeviceInfo() {
  try {
    const {width, height} = Dimensions.get('window');

    const ratio = (
      Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 100
    ).toFixed(1);

    const brand = yield call(getBrand);
    const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

    // Calculate device size
    let sizeForDevice = 'xSmall';

    if (ratio >= 10.5) {
      sizeForDevice = 'xLarge';
    } else if (ratio >= 9.7) {
      sizeForDevice = 'large';
    } else if (ratio >= 9.4) {
      sizeForDevice = 'medium';
    } else if (ratio >= 9.0) {
      sizeForDevice = 'small';
    } else {
      sizeForDevice = 'xSmall';
    }

    const deviceInfo = {
      dimensions: {
        height: Number(height.toFixed(2)),
        width: Number(width.toFixed(2)),
        ratio: Number(ratio),
      },
      system: {
        brand: formattedBrand,
        device: yield call(getDeviceType),
        deviceSize: sizeForDevice,
        model: yield call(getModel),
        os: yield call(getSystemName),
        version: yield call(getSystemVersion),
        notch: yield call(hasNotch),
      },
      view: yield call(isLandscape) ? 'Landscape' : 'Portrait',
    };

    yield put({type: 'SET_DEVICE_INFO', payload: deviceInfo});
  } catch (error) {
    yield put({type: 'DEVICE_INFO_FETCH_FAILED', payload: error.message});
  }
}

export default function* deviceSaga() {
  yield takeLatest('FETCH_DEVICE_INFO', fetchDeviceInfo);
  yield watchDeviceDimensions(); // Listens for dimension changes
}
