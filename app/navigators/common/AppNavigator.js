/**
 * @flow
 *
 * This is the basic setup of the AppNavigator to fully
 * integrate its state management with redux.
 */

import React                             from 'react';
import { addNavigationHelpers }          from 'react-navigation';
import { createReduxBoundAddListener }   from 'react-navigation-redux-helpers';
import { bindActionCreators }            from 'redux';
import { connect }                       from 'react-redux';

/** Types */
import type { Dispatch, Action }         from 'redux';
import type { ReduxActions, ReduxState } from '../../../types/redux';
import type { NavigationState }          from '../../../types/Navigation';

/** Navigators */
import { AppNavigator }                  from './AppNavigator.conf';

/** Redux Actions */
import actions                           from '../../redux/actions';

/**
 * Here you can choose what to map to the navigator
 * so that it doesn't get bloated with unneeded data
 * like the state of another navigator that is irrelevant
 * to this navigator's state.
 * @param state the whole state of the global redux store
 */
const mapStateToProps = ({ AppNavigationState }: ReduxState) => {
  return { AppNavigationState };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

type Props = {
  isTablet: boolean,
  AppNavigationState: NavigationState<any>,
  actions: ReduxActions,
  dispatch: Dispatch<Action>
}

/**
 * In order to have a navigator manually manage its state
 * you have to pass it your own navigation prop which destroys
 * the original one. addNavigationHelpers helps us construct
 * a navigation prop properly.
 * To integrate with redux, you pass the redux dispatcher to the
 * navigation prop, then map the navigation state from the corresponding
 * redux state and finally, createReduxBoundAddListener is required
 * to create a listener that listens for the same name you used in the
 * corresponding redux middleware with createReactNavigationReduxMiddleware
 * inside the redux store's initialization.
 *
 * @Note: Again, we filter out the unneeded props and pass
 * what we need through screenProps. This navigator's
 * state will already be in the navigation.state of nested
 * screens so no need to pass it through the screenProps as well.
 * @param props the props mapped from redux, and the props passed from
 */
const NavigatorWithHelpers = (props: Props) => {
  const { AppNavigationState, dispatch, isTablet } = props;
  return <AppNavigator screenProps={ { isTablet } }
                       navigation={ addNavigationHelpers({
                         dispatch,
                         state: AppNavigationState,
                         addListener: createReduxBoundAddListener('appNavigator')
                       }) } />;
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorWithHelpers);