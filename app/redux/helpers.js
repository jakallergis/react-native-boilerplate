/**
 * @flow
 *
 * Helper functions to use with our reducers or actions.
 */

/** Models / Types */
import type { Reducer }         from 'redux';
import type { MemoizedReducer } from '../../types/redux';


/**
 * Creates a reducer that in addition to state and action
 * also has knowledge of any other configuration you provide
 * during it's creation.
 * @example lets say you have the same reducer both
 * for mobile and tablet, and you want to return different
 * states based on whether the device is a tablet or not.
 * You create a memoized reducer that accepts the 'isTablet'
 * property and voila.
 * @param memo the configuration you want the reducer to have knowledge of
 * @param reducer the actual reducer that accepts the memo
 * @return {function(any, any): *} the memoized reducer that accepts state and action but also has knowledge of the memo.
 */
export const memoizedReducer = (memo: any, reducer: MemoizedReducer): Reducer<any> =>
  (state: any, action: any) => reducer(state, action, memo);