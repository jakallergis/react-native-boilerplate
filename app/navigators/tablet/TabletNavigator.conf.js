/**
 * @flow
 *
 * This is a content navigator containing the application
 * screens for mobile devices. Here should be all the logic
 * and configuration of each screen's header, titles, transitions, etc
 */

import React              from 'react';
import { StackNavigator } from 'react-navigation';

/** Screens */
import Home               from '../../screens/common/Home';
import Todos              from '../../screens/tablet/Todos';
import TodosRedux         from '../../screens/tablet/Todos.redux';

const StackNavigatorConfig = {
  initialRouteName: 'Home',
  headerMode: 'float'
};

export const RouteConfig = {
  Home: {
    screen: Home,
    navigationOptions: { title: 'Home (Tablet)' }
  },
  Todos: {
    screen: Todos,
    navigationOptions: { title: 'Todos (Tablet)' }
  },
  TodosRedux: {
    screen: TodosRedux,
    navigationOptions: { title: 'Todos With Redux (Tablet)' }
  }
};

export const TabletNavigator = StackNavigator(RouteConfig, StackNavigatorConfig);