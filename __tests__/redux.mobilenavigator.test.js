import { NavigationActions } from 'react-navigation';

/** Navigators */
import { MobileNavigator }   from '../app/navigators/mobile/MobileNavigator.conf';

/** Actions */
import rootActions           from '../app/redux/actions';
import { TodoActions }       from '../app/redux/Todos/actions';

/** Reducers */
import reducer               from '../app/redux/MobileNavigator/reducer';

const initialState = MobileNavigator.router.getStateForAction(NavigationActions.init());

describe('MobileNavigator Redux', () => {

  describe('Go to EditTodo Screen - goToEditTodo()', () => {
    const action = rootActions.goToEditTodo();

    test('reducer should return the current state with EditTodoRedux route on top', () => {
      const initialRouteName = initialState.routes[initialState.index].routeName;
      const firstState = reducer(initialState, action);
      const nextRouteName = firstState.routes[firstState.index].routeName;
      expect(firstState.routes[firstState.index - 1].routeName).toBe(initialRouteName);
      expect(nextRouteName).toBe('EditTodoRedux');
    });
  });

  describe('Go to Todos Screen - goToTodos()', () => {
    const action = rootActions.goToTodos();

    test('reducer should return the current state with TodosRedux route on top', () => {
      const initialRouteName = initialState.routes[initialState.index].routeName;
      const firstState = reducer(initialState, action);
      const nextRouteName = firstState.routes[firstState.index].routeName;
      expect(firstState.routes[firstState.index - 1].routeName).toBe(initialRouteName);
      expect(nextRouteName).toBe('TodosRedux');
    });
  });

  describe('Delete Todo - deleteTodo()', () => {
    const goToTodos = rootActions.goToTodos();
    const action = { type: TodoActions.DELETE_TODO_FINISHED };

    test('on finish reducer should pop one screen if more than one', () => {
      const initialRouteName = initialState.routes[initialState.index].routeName;
      expect(initialState.index).toBe(0);
      const firstState = reducer(initialState, goToTodos);
      expect(firstState.index).toBe(1);

      const secondState = reducer(firstState, action);
      const secondRouteName = secondState.routes[secondState.index].routeName;
      expect(secondState.index).toBe(0);
      expect(secondRouteName).toBe(initialRouteName);
    });

    test('on finish reducer should pop one screen but be in the same if not more than one', () => {
      const initialRouteName = initialState.routes[initialState.index].routeName;
      expect(initialState.index).toBe(0);

      const secondState = reducer(initialState, action);
      const secondRouteName = secondState.routes[secondState.index].routeName;
      expect(secondState.index).toBe(0);
      expect(secondRouteName).toBe(initialRouteName);
    });
  });
});