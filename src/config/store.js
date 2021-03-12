import {createStore, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import reducers from '../reducers';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['authReducer', 'userReducer', 'produkReducer'],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
  let store = createStore(persistedReducer, {}, applyMiddleware(thunk));
  let persistor = persistStore(store);
  return {store, persistor};
};
