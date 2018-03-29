/**
 * @flow
 *
 * Here we manage the state of the Application's
 * root navigator which is a root navigator.
 *
 * @Note: Here we will ignore as many NavigationActions
 * as possible so that they get handled only by the nested
 * navigators.
 * We do this because for example if the app is showing a
 * nested navigator that has a state of three Routes (index 2)
 * and we call this.props.navigation.popToTop() then instead of
 * the nested navigator popping the two screen stacks and showing us
 * its topmost route (index 0) as we would expect, this navigator will
 * change its state, switching to its topmost navigator
 */

import { NavigationActions }    from 'react-navigation';

/** Types */
import type { Action }          from 'redux';
import type { NavigationState } from '../../../types/Navigation';

/** Navigator */
import { AppNavigator }         from '../../navigators/common/AppNavigator.conf';

/** Actions */
import { AppNavigatorActions }  from './actions';

const auth = NavigationActions.navigate({ routeName: 'Auth' });
const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

export default (state: NavigationState<any> = initialState, action: Action) => {
  const { router } = AppNavigator;

  switch (action.type) {
    case NavigationActions.BACK:
    case NavigationActions.POP:
    case NavigationActions.POP_TO_TOP:
    case NavigationActions.PUSH:
    case NavigationActions.RESET:
    case NavigationActions.REPLACE:
    case NavigationActions.SET_PARAMS:
      return state;
    case AppNavigatorActions.LOGOUT_FINISHED:
      return router.getStateForAction(auth, state);
  }

  return router.getStateForAction(action, state);
}