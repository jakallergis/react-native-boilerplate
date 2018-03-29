/**
 * @flow
 *
 * The action creators for changing the AppNavigator state.
 */

/** Models / Types */
import type { Dispatch } from 'redux';

/** Utilities */
import Preferences       from '../../../backend/Preferences';

/** Action Types */
export const LOGOUT_STARTED = 'LOGOUT_STARTED';
export const LOGOUT_FINISHED = 'LOGOUT_FINISHED';

export const AppNavigatorActions = {
  LOGOUT_STARTED,
  LOGOUT_FINISHED
};

/** Action Creators */
export const logout = () => async (dispatch: Dispatch<any>) => {
  dispatch({ type: LOGOUT_STARTED });
  await Preferences.setToken();
  await new Promise(res => setTimeout(res, 5000));
  dispatch({ type: LOGOUT_FINISHED });
};

export default {
  logout
};