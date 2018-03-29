/**
 * @flow
 *
 * Here we create the root store for the app
 * based on the device type.
 *
 * @Note: In order to integrate the state of
 * react-navigation navigators with a redux
 * store we have to create a specific middleware
 * with react-navigation-redux-helpers and the
 * createReactNavigationReduxMiddleware utility.
 * For more about how this is done check out the docs at:
 * https://reactnavigation.org/docs/redux-integration.html
 */

import { applyMiddleware, createStore }         from 'redux';
import thunk                                    from 'redux-thunk';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

/** Types */
import type { Store }                           from 'redux';

/** Utilities */
import { getRootReducer }                       from './reducer';

export const createReduxStore = (isTablet: boolean): Store<any> => {

  /** Navigation Integration */
  const appNavigator = createReactNavigationReduxMiddleware('appNavigator', state => state.nav);
  const tabletNavigator = createReactNavigationReduxMiddleware('tabletNavigator', state => state.nav);
  const mobileNavigator = createReactNavigationReduxMiddleware('mobileNavigator', state => state.nav);

  /** Store Config */
  const middleware = isTablet
    ? applyMiddleware(thunk, appNavigator, tabletNavigator)
    : applyMiddleware(thunk, appNavigator, mobileNavigator);

  const reducer = getRootReducer(isTablet);

  return createStore(reducer, middleware);
};