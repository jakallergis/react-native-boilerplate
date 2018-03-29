/**
 * @flow
 *
 * Here we manage the state of the Todos object.
 */

/** Types */
import type { Action }     from 'redux';
import type { TodosState } from '../../../types/redux';

/** Actions */
import { TodoActions }     from './actions';
import { RootActions }     from '../actions';

const initialState = {
  currentTodo: null,
  editorOpen: false
};

export default (state: TodosState = initialState, action: Action) => {
  switch (action.type) {
    case TodoActions.DESELECT_TODO:
    case TodoActions.DELETE_TODO_FINISHED:
      return initialState;
    case TodoActions.SELECT_TODO:
    case RootActions.GO_TO_EDIT_TODO:
      const { currentTodo } = action;
      return { currentTodo, editorOpen: !!currentTodo };
    case TodoActions.NEW_TODO:
      return { ...initialState, editorOpen: true };
    default:
      return state;
  }
}