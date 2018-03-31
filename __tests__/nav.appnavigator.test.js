import { NavigationActions } from 'react-navigation';


/** Reducers */
import reducer               from '../app/redux/AppNavigator/reducer';

describe('AppNavigator Navigation', () => {
  describe('Reducer should explicitly ignore navigation actions:', () => {
    test('BACK', () => {
      const state = reducer(2, { type: NavigationActions.BACK });
      expect(state).toBe(2);
    });

    test('POP', () => {
      const state = reducer(2, { type: NavigationActions.POP });
      expect(state).toBe(2);
    });

    test('POP_TO_TOP', () => {
      const state = reducer(2, { type: NavigationActions.POP_TO_TOP });
      expect(state).toBe(2);
    });

    test('PUSH', () => {
      const state = reducer(2, { type: NavigationActions.PUSH });
      expect(state).toBe(2);
    });

    test('RESET', () => {
      const state = reducer(2, { type: NavigationActions.RESET });
      expect(state).toBe(2);
    });

    test('REPLACE', () => {
      const state = reducer(2, { type: NavigationActions.REPLACE });
      expect(state).toBe(2);
    });

    test('SET_PARAMS', () => {
      const state = reducer(2, { type: NavigationActions.SET_PARAMS });
      expect(state).toBe(2);
    });
  });
});