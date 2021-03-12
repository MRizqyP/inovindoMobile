import {fetchApi} from '../service/api';

export const loginUser = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'FETCH_REQUEST',
      });

      const response = await fetchApi('/category', 'GET', payload, 200);

      if (response.responseBody.auth != false) {
        dispatch({
          type: 'FETCH_SUCCES',
          payload: response.responseBody,
        });

        return response;
      } else {
        dispatch({
          type: 'FETCH_FAILED',
          payload: response.responseBody.reason,
        });
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILED',
        payload: error.responseBody,
      });
      return error;
    }
  };
};
