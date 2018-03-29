/**
 * Created by Giannis Kallergis on 25/03/2018.
 * @flow
 */

import Promise    from 'bluebird';

/** Utilities */
import Reactotron from './utils/ReactotronConfig';

/** Globals */
global.Promise = Promise;

/**
 * Reactotron is a great tool to have when developing an
 * app, because it lets you log stuff without entering the
 * debug mode in your app which makes your app go really slower.
 * This is also great for apps that use Realm as their database
 * because the way realm accesses the javascript context
 * makes it almost impossible to run the app in debug mode and
 * log stuff in the chrome dev-tools. More on this issue here:
 * https://github.com/realm/realm-js/issues/491#issuecomment-350718316
 *
 * @warning: That said, you have to know that Reactotron hangs when you
 * try to log circular objects. For example if you try to log an item
 * of a structure like this:
 * a: {
 *   b: {
 *     a: {
 *       b: {
 *         a: {...}
 * then Reactotron will hang and your app will follow. This is why I
 * have the flattened() method inside the RealmObject class which is
 * very expensive but also helps with this problem. In my apps, i also
 * implement a patch to the Reactotron.log method that logs only
 * specific levels deep.
 */
global.Reactotron = Reactotron;