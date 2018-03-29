/**
 * @flow
 *
 * Here we create the root reducer for the app
 * based on the device type.
 *
 * @Note: Here is also the place to put reducers
 * that manage the state of root items in the
 * redux state like the UIFrozen property that
 * makes the UIFreezer in the Root App.js Component
 * visible and thus rendering the ui unusable.
 */

import { combineReducers }     from 'redux';

/** Models / Types */
import type { Action }         from 'redux';

/** Actions */
import { AppNavigatorActions } from './AppNavigator/actions';
import { TodoActions }         from './Todos/actions';

/** Reducers */
import AppNavigationState      from './AppNavigator/reducer';
import TabletNavigationState   from './TabletNavigator/reducer';
import MobileNavigationState   from './MobileNavigator/reducer';
import Todos                   from './Todos/reducer';

const UIFrozen = (state: boolean = false, action: Action) => {
  switch (action.type) {
    case AppNavigatorActions.LOGOUT_STARTED:
    case TodoActions.DELETE_TODO_STARTED:
      return true;
    case AppNavigatorActions.LOGOUT_FINISHED:
    case TodoActions.DELETE_TODO_FINISHED:
      return false;
    default:
      return state;
  }
};

export const getRootReducer = (isTablet: boolean) => {
  if (isTablet) {
    return combineReducers({
      UIFrozen,
      AppNavigationState,
      TabletNavigationState,
      Todos
    });
  } else {
    return combineReducers({
      UIFrozen,
      AppNavigationState,
      MobileNavigationState,
      Todos
    });
  }
};