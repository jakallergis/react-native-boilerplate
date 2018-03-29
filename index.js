/**
 * @flow
 *
 * This is a React Native Boilerplate integrating some
 * of the commonly used technologies and packages:
 *
 *  - Redux
 *  - React-Navigation fully integrated with Redux
 *    (every navigator managing its own state reducer),
 *  - Realm-JS for the persistence of data layer,
 *  - Flow for static typing
 */

import { AppRegistry } from 'react-native';

/** Globals */
import './global';

/** Components */
import App             from './App';

AppRegistry.registerComponent('ReactNativeBoilerplate', () => App);
