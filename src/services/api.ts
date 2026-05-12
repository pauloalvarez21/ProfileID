import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { Config } from '../config';

const storage = new MMKV();

const api = axios.create({
  baseURL: `${Config.BASE_URL}${Config.API_PREFIX}`,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para inyectar el token
api.interceptors.request.use(async (config) => {
  const token = storage.getString('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para normalizar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Estructura de error estandarizada
    const errorPayload = {
      message: error.response?.data?.message || 'common.serverError',
      status: error.response?.status,
      isNetworkError: !error.response,
    };

    if (error.code === 'ECONNABORTED') {
      errorPayload.message = 'errors.networkError';
    }

    if (!error.response) {
      errorPayload.message = 'errors.networkError';
    }

    return Promise.reject(errorPayload);
  }
);

export default api;