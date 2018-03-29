/**
 * @flow
 *
 * The action creators for changing the Todos state.
 */

/** Models / Types */
import type { Dispatch }   from 'redux';
import type { ReduxState } from '../../../types/redux';
import Todo                from '../../../backend/db/models/Todo';

/** Utilities */
import Database            from '../../../backend/db/TodoDatabase';

/** Action Types */
export const NEW_TODO = 'NEW_TODO';
export const SELECT_TODO = 'SELECT_TODO';
export const DESELECT_TODO = 'DESELECT_TODO';
export const DELETE_TODO_STARTED = 'DELETE_TODO_STARTED';
export const DELETE_TODO_FINISHED = 'DELETE_TODO_FINISHED';

export const TodoActions = {
  NEW_TODO,
  SELECT_TODO,
  DESELECT_TODO,
  DELETE_TODO_STARTED,
  DELETE_TODO_FINISHED
};

/** Action Creators */
export const newTodo = () => ({ type: NEW_TODO });
export const selectTodo = (currentTodo: Todo) => ({ type: SELECT_TODO, currentTodo });
export const deselectTodo = () => ({ type: DESELECT_TODO });

export const deleteTodo = () => async (dispatch: Dispatch<any>, getState: () => ReduxState) => {
  dispatch({ type: DELETE_TODO_STARTED });
  await new Promise(res => setTimeout(res, 2000)); // Simulating heavy instruction
  const { Todos: { currentTodo } } = getState();
  if (currentTodo && currentTodo.UUID) Database.deleteTodoByUUID(currentTodo.UUID);
  dispatch({ type: DELETE_TODO_FINISHED });
};

export default {
  newTodo,
  selectTodo,
  deselectTodo,
  deleteTodo
};