import {fetchApi} from '../service/api';

export const createNewUser = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'CREATE_USER_LOADING',
      });

      const response = await fetchApi('/register', 'POST', payload, 200);

      dispatch({
        type: 'CREATE_USER_SUCCESS',
      });

      dispatch({
        type: 'GET_USER_SUCCESS',
      });

      return response;
    } catch (error) {
      dispatch({
        type: 'CREAT_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const loginUser = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });

      const response = await fetchApi('/login', 'POST', payload, 200);

      if (response.responseBody.auth === true) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken,
          id: response.responseBody.id,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody,
        });
        return response;
      } else {
        dispatch({
          type: 'LOGIN_USER_FAIL',
          payload: response.responseBody.reason,
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const Layanan = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'LOGIN_USER_LOADING',
      });

      const response = await fetchApi('/login', 'POST', payload, 200);

      if (response.responseBody.auth === true) {
        dispatch({
          type: 'LOGIN_USER_SUCCESS',
        });
        dispatch({
          type: 'AUTH_USER_SUCCESS',
          token: response.responseBody.accessToken,
          id: response.responseBody.id,
        });
        dispatch({
          type: 'GET_USER_SUCCESS',
          payload: response.responseBody,
        });
        return response;
      } else {
        dispatch({
          type: 'LOGIN_USER_FAIL',
          payload: response.responseBody.reason,
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_FAIL',
        payload: error.responseBody,
      });
      return error;
    }
  };
};

export const logoutUser = () => {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const {
        authReducer: {
          authData: {token},
        },
      } = state;

      dispatch({
        type: 'USER_LOGGED_OUT_SUCCESS',
      });
    } catch (e) {}
  };
};
