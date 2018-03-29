/**
 * @flow
 *
 * The action creators that constitute the total of actions
 * in our redux store.
 *
 * @Note: Here is also the place to put any action creators
 * that should be the same for multiple states. For example
 * the GO_TO_TODOS action is directly handled by both the
 * MobileNavigator's and TabletNavigator's reducers, so instead
 * of having a MOBILE_GO_TO_TODOS and a TABLET_GO_TO_TODOS
 * we place a single action here for both of them to share.
 * This is clearly for consistency in the project structure.
 */

/** Models / Types */
import Todo                   from '../../backend/db/models/Todo';

/** External Action Creators */
import AppNavigatorActions    from './AppNavigator/actions';
import MobileNavigatorActions from './MobileNavigator/actions';
import TabletNavigatorActions from './TabletNavigator/actions';
import TodoActions            from './Todos/actions';

/** Action Types */
export const GO_TO_TODOS = 'GO_TO_TODOS';
export const GO_TO_EDIT_TODO = 'GO_TO_EDIT_TODO';

export const RootActions = {
  GO_TO_TODOS,
  GO_TO_EDIT_TODO
};

/** Action Creators */
export const goToTodos = () => ({ type: GO_TO_TODOS });
export const goToEditTodo = (currentTodo: ?Todo) => ({ type: GO_TO_EDIT_TODO, currentTodo });

export default {
  goToTodos,
  goToEditTodo,
  ...AppNavigatorActions,
  ...MobileNavigatorActions,
  ...TabletNavigatorActions,
  ...TodoActions
};