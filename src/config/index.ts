import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const Config = {
  // Configuración local - sin backend
};

export const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.delete(name),
};
