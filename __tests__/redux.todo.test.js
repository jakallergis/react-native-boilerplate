/** Actions */
import actions, { TodoActions } from '../app/redux/Todos/actions';
import rootActions              from '../app/redux/actions';

/** Reducers */
import reducer                  from '../app/redux/Todos/reducer';
import { UIFrozen }             from '../app/redux/reducer';

/** Utilities */
import TodoDatabase             from '../backend/db/TodoDatabase';

describe('Todo Redux', () => {

  const todo = TodoDatabase.createNewTodo();

  describe('New Todo - newTodo()', () => {
    const action = actions.newTodo();
    test('action should have the correct type', () => {
      expect(action.type).toBe(TodoActions.NEW_TODO);
    });

    const state = reducer(null, action);
    test('reducer should return no currentTodo', () => {
      expect(state.currentTodo).toBe(null);
    });

    test('reducer should return editorOpen true', () => {
      expect(state.editorOpen).toBe(true);
    });
  });

  describe('Select Todo - selectTodo()', () => {
    const action = actions.selectTodo(todo);

    test('action should have the correct type', () => {
      expect(action.type).toBe(TodoActions.SELECT_TODO);
    });

    test('action should have the currentTodo', () => {
      expect(action.currentTodo).toBe(todo);
    });

    test('reducer should return the currentTodo', () => {
      const state = reducer(null, action);
      expect(state.currentTodo).toMatchObject(todo);
    });

    test('reducer should return editorOpen true', () => {
      const state = reducer(null, action);
      expect(state.editorOpen).toBe(true);
    });
  });

  describe('Deselect Todo - deselectTodo()', () => {
    const selectAction = actions.selectTodo(todo);
    const selectState = reducer(null, selectAction);

    const action = actions.deselectTodo();
    test('action should have the correct type', () => {
      expect(action.type).toBe(TodoActions.DESELECT_TODO);
    });

    const state = reducer(selectState, action);
    test('reducer should return no currentTodo', () => {
      expect(state.currentTodo).toBe(null);
    });

    test('reducer should return editorOpen false', () => {
      expect(state.editorOpen).toBe(false);
    });
  });

  describe('Delete Todo - deleteTodo()', () => {
    const startedAction = { type: TodoActions.DELETE_TODO_STARTED };
    const finishedAction = { type: TodoActions.DELETE_TODO_FINISHED };

    const selectAction = actions.selectTodo(todo);
    const selectState = reducer(null, selectAction);

    test('UI should freeze on start', () => {
      const UIFrozenOnStart = UIFrozen(null, startedAction);
      expect(UIFrozenOnStart).toBe(true);
    });

    const thunk = actions.deleteTodo();
    test('action should return a function (thunk)', () => {
      expect(thunk).toEqual(expect.any(Function));
    });

    test('thunk should call getState once and dispatch start and finish', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({ Todos: { currentTodo: todo } }));
      await thunk(dispatch, getState);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(getState).toHaveBeenCalledTimes(1);

      expect(dispatch.mock.calls[0][0]).toMatchObject(startedAction);
      expect(dispatch.mock.calls[1][0]).toMatchObject(finishedAction);
    });

    test('thunk should delete the currentTodo', () => {
      expect(() => todo.title).toThrowError('Accessing object of type Todo which has been invalidated or deleted');
    });

    const state = reducer(selectState, finishedAction);
    test('reducer should return no currentTodo', () => {
      expect(state.currentTodo).toBe(null);
    });

    test('reducer should return editorOpen false', () => {
      expect(state.editorOpen).toBe(false);
    });

    test('UI should unfreeze on finish', () => {
      const UIFrozenOnFinish = UIFrozen(null, finishedAction);
      expect(UIFrozenOnFinish).toBe(false);
    });
  });

  describe('Go to EditTodo Screen', () => {
    const actionWithTodo = rootActions.goToEditTodo(todo);
    const actionWithoutTodo = rootActions.goToEditTodo();

    describe('if action has currentTodo', () => {
      const state = reducer(null, actionWithTodo);
      test('reducer should return the currentTodo', () => {
        expect(state.currentTodo).toBe(todo);
      });

      test('reducer should return editorOpen true', () => {
        expect(state.editorOpen).toBe(true);
      });
    });

    describe('if action does not have currentTodo', () => {
      const state = reducer(null, actionWithoutTodo);
      test('reducer should return undefined currentTodo', () => {
        expect(state.currentTodo).toBe(undefined);
      });

      test('reducer should return editorOpen false', () => {
        expect(state.editorOpen).toBe(false);
      });
    });
  });
})
;