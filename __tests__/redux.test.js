import actions, { RootActions } from '../app/redux/actions';

describe('Root Redux actions and state', () => {

  test('Go To Todos', () => {
    const action = actions.goToTodos();
    expect(action.type).toBe(RootActions.GO_TO_TODOS);
  });

  test('Go To Edit Todo', () => {
    const todo = 'mock todo';
    const action = actions.goToEditTodo(todo);
    expect(action.type).toBe(RootActions.GO_TO_EDIT_TODO);
    expect(action.currentTodo).toBe(todo);
  });
});