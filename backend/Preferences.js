/**
 * @flow
 */

import { AsyncStorage } from 'react-native';

/** Globals */
const { Promise } = global;

const setToken = (newToken: ?string): Promise<void> => {
  if (!newToken) return AsyncStorage.removeItem('token');
  return AsyncStorage.setItem('token', newToken);
};

const getToken = async (): Promise<?string> => await AsyncStorage.getItem('token');

export default {
  setToken,
  getToken
};