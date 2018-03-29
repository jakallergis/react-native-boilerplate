/**
 * @flow
 *
 * This is the root navigator containing all the
 * screens and navigators that constitute the overall
 * navigation of the application.
 * This Consists of the LaunchScreen which decides
 * if the app needs to authenticate or not, and
 * navigate to the AuthNavigator containing the
 * Auth Screens and logic, or to the proper
 * content navigator containing the applications
 * screens, based on the type of the device (tablet or not)
 */

import { SwitchNavigator } from 'react-navigation';

/** Navigators */
import { AuthNavigator }   from './AuthNavigator';
import TabletNavigator     from '../tablet/TabletNavigator';
import MobileNavigator     from '../mobile/MobileNavigator';

/** Screens */
import LaunchScreen        from '../../screens/common/LaunchScreen';

/**
 * Haven't figured out yet how to implement navigator
 * configuration like per screen headers, and styles.
 */

const SwitchNavigatorConfig = {
  initialRouteName: 'LaunchScreen'
};

const RouteConfig = {
  LaunchScreen,
  Auth: AuthNavigator,
  Tablet: TabletNavigator,
  Mobile: MobileNavigator
};

export const AppNavigator = SwitchNavigator(RouteConfig, SwitchNavigatorConfig);