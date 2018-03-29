/**
 * @flow
 *
 * Here we manage the state of the MobileNavigator which is
 * a nested navigator inside the root navigator which is the
 * AppNavigator.
 *
 * @Note: We have filtered most of the navigation actions from
 * the root navigator so that the nested ones like this one, can
 * manage their state without the root navigator disrupting.
 */

import { NavigationActions }    from 'react-navigation';

/** Types */
import type { Action }          from 'redux';
import type { NavigationState } from '../../../types/Navigation';

/** Navigator */
import { MobileNavigator }      from '../../navigators/mobile/MobileNavigator.conf';

/** Actions */
import { RootActions }          from '../actions';
import { TodoActions }          from '../Todos/actions';

const todosRedux = NavigationActions.navigate({ routeName: 'TodosRedux' });
const editTodoRedux = NavigationActions.navigate({ routeName: 'EditTodoRedux' });
const initialState = MobileNavigator.router.getStateForAction(NavigationActions.init());

export default (state: NavigationState<any> = initialState, action: Action) => {
  const { router } = MobileNavigator;

  switch (action.type) {
    case RootActions.GO_TO_EDIT_TODO:
      return router.getStateForAction(editTodoRedux, state);
    case RootActions.GO_TO_TODOS:
      return router.getStateForAction(todosRedux, state);
    case TodoActions.DELETE_TODO_FINISHED:
      return router.getStateForAction(NavigationActions.pop(), state);
  }

  return router.getStateForAction(action, state);
}