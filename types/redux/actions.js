// @flow

/** Models / Types */
import type { Action }      from 'redux';
import type { ThunkAction } from 'redux-thunk';
import Todo                 from '../../backend/db/models/Todo';

/** Root Actions */
export type logout = () => ThunkAction

/** MobileNavigator */
export type goToTodos = () => Action
export type goToEditTodo = (currentTodo: ?Todo) => Action

/** Todos */
export type newTodo = () => Action
export type selectTodo = (currentTodo: Todo) => Action
export type deselectTodo = () => Action
export type deleteTodo = () => Action

export type ReduxActions = {
  logout: logout,
  goToTodos: goToTodos,
  goToEditTodo: goToEditTodo,
  newTodo: newTodo,
  selectTodo: selectTodo,
  deselectTodo: deselectTodo,
  deleteTodo: deleteTodo
}