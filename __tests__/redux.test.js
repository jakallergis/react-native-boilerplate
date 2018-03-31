import actions, { RootActions } from '../app/redux/actions';

describe('Root Redux', () => {

  describe('Go to Todos Screen', () => {
    const action = actions.goToTodos();
    test('action should have the correct type', () => {
      expect(action.type).toBe(RootActions.GO_TO_TODOS);
    });
  });

  describe('Go to EditTodo Screen', () => {
    const todo = 'mock todo';
    const actionWithTodo = actions.goToEditTodo(todo);
    const actionWithoutTodo = actions.goToEditTodo();

    test('action should have the correct type', () => {
      expect(actionWithTodo.type).toBe(RootActions.GO_TO_EDIT_TODO);
      expect(actionWithoutTodo.type).toBe(RootActions.GO_TO_EDIT_TODO);
    });

    describe('if action has currentTodo', () => {
      test('action should have the currentTodo', () => {
        expect(actionWithTodo.currentTodo).toBe(todo);
      });
    });

    describe('if action does not have currentTodo', () => {
      test('action should have undefined currentTodo', () => {
        expect(actionWithoutTodo.currentTodo).toBe(undefined);
      });
    });
  });
});