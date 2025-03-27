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
    const pixelRatio = PixelRatio.get();
    const pixelWidth = width * pixelRatio;
    const pixelHeight = height * pixelRatio;

    const ratio = (
      Math.sqrt(Math.pow(pixelWidth, 2) + Math.pow(pixelHeight, 2)) / 100
    ).toFixed(2);

    const brand = yield call(getBrand);
    const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

    // Calculate device size
    let sizeForDevice = 'xSmall';

    if (pixelWidth >= 1300) {
      sizeForDevice = 'xLarge'; // Ultra-sized phones
    } else if (pixelWidth >= 1250) {
      sizeForDevice = 'large'; // Large phones
    } else if (pixelWidth >= 1200) {
      sizeForDevice = 'medium'; // Standard flagships
    } else if (pixelWidth >= 1000) {
      sizeForDevice = 'small'; // Smaller phones
    } else {
      sizeForDevice = 'xSmall'; // Compact phones
    }

    const deviceInfo = {
      dimensions: {
        height: Number(height.toFixed(0)),
        width: Number(width.toFixed(0)),
      },
      screen: {
        pixelHeight: pixelHeight,
        pixelWidth: pixelWidth,
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
