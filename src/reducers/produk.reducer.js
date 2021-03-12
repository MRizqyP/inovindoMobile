import {combineReducers} from 'redux';

const getProduk = (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        isLoading: true,
        isFailed: false,
        errors: null,
      };

    case 'FETCH_SUCCES':
      return {
        isLoading: false,
        isFailed: false,
        produk: action.payload,
        errors: null,
      };

    case 'FETCH_FAILED':
      return {
        isLoading: false,
        isFailed: true,
        errors: action.payload,
      };

    default:
      return state;
  }
};

export default combineReducers({
  getProduk,
});
