import {BASE_URL} from './base_url';
// const BASE_URL = 'http://a60d1c3da7e0.ngrok.io';

export const api = async (url, method, body = null, headers = {}) => {
  try {
    const endPoint = BASE_URL.concat(url);
    const reqBody = body ? JSON.stringify(body) : null;

    const fetchParams = {method, headers};

    if ((method === 'POST' || method === 'PUT') && !reqBody) {
      throw new Error('Request body required');
    }

    if (reqBody) {
      fetchParams.headers['Content-type'] = 'application/json';
      fetchParams.body = reqBody;
    }

    const fetchPromise = fetch(endPoint, fetchParams);
    const timeOutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Request Timeout');
      }, 3000);
    });

    const response = await Promise.race([fetchPromise, timeOutPromise]);

    return response;
  } catch (e) {
    return e;
  }
};

export const fetchApi = async (
  url,
  method,
  body,
  statusCode,
  token = null,
  loader = false,
) => {
  try {
    const headers = {};
    const result = {
      responseBody: null,
      status: statusCode,
    };
    if (token) {
      headers['x-auth'] = token;
    }

    const response = await api(url, method, body, headers);

    if (response.status === statusCode) {
      result.success = true;

      if (response.headers.get('x-auth')) {
        result.token = response.headers.get('x-auth');
      }

      let responseBody;
      const responseText = await response.text();

      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = responseText;
      }

      result.responseBody = responseBody;
      return result;
    }

    let errorBody;
    const errorText = await response.text();

    try {
      errorBody = JSON.parse(errorText);
    } catch (e) {
      errorBody = errorText;
    }

    result.responseBody = errorBody;

    throw result;
  } catch (error) {
    return error;
  }
};
