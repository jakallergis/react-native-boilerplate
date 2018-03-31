/**
 * @flow
 *
 * Here we manage the state of the TabletNavigator which is
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
import { TabletNavigator }      from '../../navigators/tablet/TabletNavigator.conf';
import { RootActions }          from '../actions';

const initialState = TabletNavigator.router.getStateForAction(NavigationActions.init());
const todosRedux = NavigationActions.navigate({ routeName: 'TodosRedux' });

export default (state: NavigationState<any> = initialState, action: Action) => {
  const { router } = TabletNavigator;
  switch (action.type) {
    case RootActions.GO_TO_TODOS:
      return router.getStateForAction(todosRedux, state);
  }
  return router.getStateForAction(action, state);
}