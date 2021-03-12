import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import produkReducer from './produk.reducer';

const reducers = {
  form: formReducer,
  authReducer,
  userReducer,
  produkReducer,
};

const appReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGGED_OUT_SUCCESS') {
    state = {};
  }

  return appReducer(state, action);
};

export default rootReducer;
