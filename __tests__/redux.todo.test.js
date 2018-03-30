/** Actions */
import actions, { TodoActions }     from '../app/redux/Todos/actions';
import rootActions, { RootActions } from '../app/redux/actions';

/** Reducers */
import reducer                      from '../app/redux/Todos/reducer';
import { UIFrozen }                 from '../app/redux/reducer';

/** Utilities */
import TodoDatabase                 from '../backend/db/TodoDatabase';

describe('Todo Redux actions and state', () => {

  test('New Todo', () => {
    const action = actions.newTodo();
    expect(action.type).toBe(TodoActions.NEW_TODO);

    const state = reducer(null, action);
    expect(state.currentTodo).toBe(null);
    expect(state.editorOpen).toBe(true);
  });

  test('Select Todo', () => {
    const todo = 'mock todo';
    const action = actions.selectTodo(todo);
    expect(action.type).toBe(TodoActions.SELECT_TODO);
    expect(action.currentTodo).toBe(todo);

    const state = reducer(null, action);
    expect(state.currentTodo).toBe(todo);
    expect(state.editorOpen).toBe(true);
  });

  test('Deselect Todo', () => {
    const todo = 'mock todo';
    const action = actions.selectTodo(todo);
    expect(action.type).toBe(TodoActions.SELECT_TODO);
    expect(action.currentTodo).toBe(todo);

    const state = reducer(null, action);
    expect(state.currentTodo).toBe(todo);
    expect(state.editorOpen).toBe(true);

    const nextAction = actions.deselectTodo();
    expect(nextAction.type).toBe(TodoActions.DESELECT_TODO);

    const nextState = reducer(state, nextAction);
    expect(nextState.currentTodo).toBe(null);
    expect(nextState.editorOpen).toBe(false);
  });

  test('Delete Todo (Thunk)', async () => {
    const todo = TodoDatabase.createNewTodo();
    const action = actions.selectTodo(todo);
    expect(action.type).toBe(TodoActions.SELECT_TODO);
    expect(action.currentTodo).toBe(todo);

    const state = reducer(null, action);
    expect(state.currentTodo).toBe(todo);
    expect(state.editorOpen).toBe(true);

    const startedAction = { type: TodoActions.DELETE_TODO_STARTED };
    const finishedAction = { type: TodoActions.DELETE_TODO_FINISHED };

    const dispatchedActions = [];
    const dispatch = jest.fn((action) => dispatchedActions.push(action));
    const getState = jest.fn(() => ({ Todos: { currentTodo: todo } }));

    const thunk = actions.deleteTodo();
    await thunk(dispatch, getState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(startedAction);
    expect(dispatch).toHaveBeenCalledWith(finishedAction);
    expect(dispatch).toHaveBeenLastCalledWith(finishedAction);
    expect(dispatchedActions.length).toBe(2);
    expect(dispatchedActions[0].type).toBe(startedAction.type);
    expect(dispatchedActions[1].type).toBe(finishedAction.type);
    expect(getState).toHaveBeenCalledTimes(1);

    const nextState = reducer(state, finishedAction);
    expect(nextState.currentTodo).toBe(null);
    expect(nextState.editorOpen).toBe(false);

    expect(() => todo.title).toThrowError('Accessing object of type Todo which has been invalidated or deleted');

    const UIFrozenOnStart = UIFrozen(null, startedAction);
    expect(UIFrozenOnStart).toBe(true);
    const UIFrozenOnFinish = UIFrozen(null, finishedAction);
    expect(UIFrozenOnFinish).toBe(false);
  });

  test('Go to edit todo', () => {
    const todo = 'mock todo';
    const action = rootActions.goToEditTodo(todo);
    expect(action.type).toBe(RootActions.GO_TO_EDIT_TODO);
    expect(action.currentTodo).toBe(todo);

    const state = reducer(null, action);
    expect(state.currentTodo).toBe(todo);
    expect(state.editorOpen).toBe(!!todo);
  });
});