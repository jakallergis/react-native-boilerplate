import { NavigationActions } from 'react-navigation';

/** Navigators */
import { TabletNavigator }   from '../app/navigators/tablet/TabletNavigator.conf';
import reducer               from '../app/redux/TabletNavigator/reducer';
import rootActions           from '../app/redux/actions';

const initialState = TabletNavigator.router.getStateForAction(NavigationActions.init());

describe('TabletNavigator Redux', () => {
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
});
