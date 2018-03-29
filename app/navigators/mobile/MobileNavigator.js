/**
 * @flow
 *
 * This is the basic setup of the MobileNavigator to fully
 * integrate its state management with redux.
 */

import React                                         from 'react';
import { addNavigationHelpers }                      from 'react-navigation';
import { createReduxBoundAddListener }               from 'react-navigation-redux-helpers';
import { bindActionCreators }                        from 'redux';
import { connect }                                   from 'react-redux';

/** Types */
import type { Dispatch, Action }                     from 'redux';
import type { ReduxActions, ReduxState, TodosState } from '../../../types/redux';
import type { NavigationState, Navigation }          from '../../../types/Navigation';

/** Navigators */
import { MobileNavigator }                           from './MobileNavigator.conf';

/** Redux Actions */
import actions                                       from '../../redux/actions';

/**
 * Here you can choose what to map to the navigator
 * so that it doesn't get bloated with unneeded data
 * like the state of another navigator that is irrelevant
 * to this navigator's state.
 * @param state the whole state of the global redux store
 */
const mapStateToProps = ({ MobileNavigationState, Todos }: ReduxState) => {
  return { MobileNavigationState, Todos };
};

/**
 * Similarly here you can map only the specific action
 * creators this navigator's screen might need. For example
 * you could filter out, navigation actions that are relevant
 * only to the tablet navigator.
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

type Props = {
  screenProps: { isTablet: boolean }, // from parent navigator because this is a navigator-as-a-screen
  navigation: Navigation<any>, // from parent navigator because this is a navigator-as-a-screen
  MobileNavigationState: NavigationState<any>,
  Todos: TodosState,
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
 *
 * @Note: Because this navigator is nested as another navigator's
 * screen (AppNavigator) we should extract the screenProps properties
 * we need to pass through, otherwise we will have screenProps within
 * screenProps inside this navigator's screens.
 *
 * @Note: We ignore passing through the isTablet prop since we know
 * we are on a mobile device. So every screen of this navigator will
 * know because their "isTablet" prop will be falsy.
 * @param props the props mapped from redux, and the props passed from
 */
const NavigatorWithHelpers = (props: Props) => {
  const { MobileNavigationState, dispatch, screenProps, actions, Todos } = props;
  const { isTablet } = screenProps;
  return <MobileNavigator screenProps={ { isTablet, actions, Todos } }
                          navigation={ addNavigationHelpers({
                            dispatch,
                            state: MobileNavigationState,
                            addListener: createReduxBoundAddListener('mobileNavigator')
                          }) } />;
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorWithHelpers);