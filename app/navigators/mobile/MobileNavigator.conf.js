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
import Todos              from '../../screens/mobile/Todos';
import TodosRedux         from '../../screens/mobile/Todos.redux';
import EditTodo           from '../../screens/mobile/EditTodo';
import EditTodoRedux      from '../../screens/mobile/EditTodo.redux';

const StackNavigatorConfig = {
  initialRouteName: 'Home',
  headerMode: 'float'
};

export const RouteConfig = {
  Home: {
    screen: Home,
    navigationOptions: { title: 'Home (Mobile)' }
  },
  Todos: {
    screen: Todos,
    navigationOptions: { title: 'Todos (Mobile)' }
  },
  TodosRedux: {
    screen: TodosRedux,
    navigationOptions: { title: 'Todos With Redux (Mobile)' }
  },
  EditTodo: {
    screen: EditTodo,
    navigationOptions: ({ navigation: { state: { params = {} } } }: any) => ({
      title: params.todo && params.todo.isValid() && params.todo.title || 'New Todo (Mobile)'
    })
  },
  EditTodoRedux: {
    screen: EditTodoRedux,
    navigationOptions: ({ screenProps: { Todos: { currentTodo } } }: any) => ({
      title: currentTodo && currentTodo.isValid() && currentTodo.title || 'New Todo With Redux (Mobile)'
    })
  }
};

export const MobileNavigator = StackNavigator(RouteConfig, StackNavigatorConfig);