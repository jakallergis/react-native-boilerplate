/**
 * @flow
 *
 * This navigator contains all the screens responsible
 * for the authentication of the app's user. It is not
 * required to be managed by Redux, but if needed it is
 * easy to do, following the same process as the other navigators.
 *
 * When you want to navigate to a screen of this navigator
 * you have some caveats to consider:
 *
 * - Navigating to the navigator (from a SwitchNavigator like AppNavigator):
 *    if you call this.props.navigation.navigate('Auth') from any
 *    screen it will switch to this navigator, and thus showing a
 *    state of one screen (index 0) - the first screen or the one
 *    specified by the initialRouteName
 * - Navigating to a screen:
 *    if you call this.props.navigation.navigate('Login') then you
 *    two steps will happen:
 *      1. it will switch to this navigator, and thus showing a state
 *      of one screen (index 0) - the initial Route
 *      2. it will navigate to the Login screen.
 *    This will leave you with a state of two screens (index 1) - the
 *    initial Route, and on top the Login screen.
 *    In our case the Login screen is the initial Route so in fact we
 *    would end up with a Login screen on top of a Login Screen
 * - Resetting to a specific state of this navigator with multiple screens:
 *    if you want to dispatch a NavigationActions.reset({...}) action from
 *    a screen not in this navigator, then most probably the best solution
 *    would be to integrate this navigator with redux and create a specific
 *    actionCreator for that which you would call from anywhere in the app
 *    and then create a case for that action in the navigator's reducer
 *    which would return the required state.
 */

import { StackNavigator } from 'react-navigation';

/** Screens */
import Login              from '../../screens/common/Login';

export const RouteConfig = {
  Login: {
    screen: Login,
    navigationOptions: { title: 'Login' }
  }
};

export const AuthNavigator = StackNavigator(RouteConfig);