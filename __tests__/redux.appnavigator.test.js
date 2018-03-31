import { NavigationActions }            from 'react-navigation';

/** Navigators */
import { AppNavigator }                 from '../app/navigators/common/AppNavigator.conf';

/** Actions */
import actions, { AppNavigatorActions } from '../app/redux/AppNavigator/actions';

/** Reducers */
import reducer                          from '../app/redux/AppNavigator/reducer';
import { UIFrozen }                     from '../app/redux/reducer';

/** Utilities */
jest.mock('../backend/Preferences');
import Preferences                      from '../backend/Preferences';

export const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

describe('AppNavigator Redux', () => {
  describe('Logout - logout()', () => {
    const startedAction = { type: AppNavigatorActions.LOGOUT_STARTED };
    const finishedAction = { type: AppNavigatorActions.LOGOUT_FINISHED };

    test('UI should freeze on start', () => {
      const UIFrozenOnStart = UIFrozen(null, startedAction);
      expect(UIFrozenOnStart).toBe(true);
    });

    const thunk = actions.logout();
    test('action should return a function (thunk)', () => {
      expect(thunk).toEqual(expect.any(Function));
    });

    test('thunk should call dispatch on start and finish', async () => {
      jest.setTimeout(10000);
      const dispatch = jest.fn();
      await thunk(dispatch);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch.mock.calls[0][0]).toMatchObject(startedAction);
      expect(dispatch.mock.calls[1][0]).toMatchObject(finishedAction);
    });

    test('thunk should call Preferences.setToken to empty the token', async () => {
      jest.setTimeout(10000);
      const spy = jest.spyOn(Preferences, 'setToken');
      const dispatch = jest.fn();
      await thunk(dispatch);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toBeCalledWith();
      spy.mockRestore();
    });

    test('reducer should return the Auth Navigator Screen', () => {
      const state = reducer(initialState, finishedAction);
      const { routeName } = state.routes[state.index];
      expect(routeName).toBe('Auth');
    });

    test('UI should unfreeze on finish', () => {
      const UIFrozenOnFinish = UIFrozen(null, finishedAction);
      expect(UIFrozenOnFinish).toBe(false);
    });
  });
});