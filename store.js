// store.js
import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './src/redux/reducers/_root.reducer';
import rootSaga from './src/redux/sagas/_root.saga';

// Use CJS require to avoid ESM/CJS interop issues in redux-saga@1.3.x
const SagaPkg = require('redux-saga');
const createSagaMiddleware =
  (typeof SagaPkg.default === 'function' && SagaPkg.default) ||
  (typeof SagaPkg.createSagaMiddleware === 'function' &&
    SagaPkg.createSagaMiddleware) ||
  SagaPkg;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'profile', 'account', 'shopping', 'cupboard'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export {store, persistor};
