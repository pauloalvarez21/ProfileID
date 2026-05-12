import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const Config = {
  //BASE_URL: 'https://hardcore-tucking-glaring.ngrok-free.dev',    // Reemplaza con tu IP local para pruebas en dispositivo
  BASE_URL: 'http://52.90.130.30:8082',    // Reemplaza con tu IP local para pruebas en emulador
  API_PREFIX: '/api/v1',                      // Prefijo de tu API (ej: /api/v1)
};

export const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};