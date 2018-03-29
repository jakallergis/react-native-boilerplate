// @flow

/** Models / Types */
import type { NavigationState } from '../Navigation';
import Todo                     from '../../backend/db/models/Todo';

export type TodosState = {
  currentTodo: ?Todo,
  editorOpen: boolean
}

export type ReduxState = {
  UIFrozen: boolean,
  Todos: TodosState,
  AppNavigationState: NavigationState<any>,
  MobileNavigationState: NavigationState<any>,
  TabletNavigationState: NavigationState<any>,
}