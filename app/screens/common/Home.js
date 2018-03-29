/**
 * @flow
 *
 * This screen is where your app starts after
 * the authentication steps and logic in the
 * screens defined in the AuthNavigator.
 *
 * You can split its logic and render different
 * components for each device and platform.
 */

import React, { Component }                from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';

/** Types */
import type { Navigation }                 from '../../../types/Navigation';
import type { ReduxActions, TodosState }   from '../../../types/redux';

/** Utilities */
import Preferences                         from '../../../backend/Preferences';

type Props = {
  screenProps: {
    isTablet: boolean,
    actions: ReduxActions,
    Todos: TodosState,
  },
  navigation: Navigation<any>
}

export default class Home extends Component<Props> {

  /** Button Handlers */

  _logout = () => {
    Preferences.setToken()
      .then(() => this.props.navigation.navigate('Auth'))
      .catch(this._handleErrors);
  };

  _goToTodos = () => this.props.navigation.navigate('Todos');
  _goToLaunchScreen = () => this.props.navigation.navigate('LaunchScreen');

  _logoutRedux = () => this.props.screenProps.actions.logout();
  _goToTodosRedux = () => this.props.screenProps.actions.goToTodos();

  /** Generic Handlers */

  _handleErrors = (e: Error) => {
    const buttons = [{ text: 'OK', type: 'cancel' }];
    Alert.alert('Error', e.message, buttons);
  };

  /** Renderers */

  render() {
    return (
      <View style={ styles.container }>
        <Button title='Todos without Redux' onPress={ this._goToTodos } />
        <Button title='Todos with Redux' onPress={ this._goToTodosRedux } />
        <Button title='Logout' onPress={ this._logout } />
        <Button title='Logout and freeze the UI using a redux action' onPress={ this._logoutRedux } />
        <Button title='LaunchScreen' onPress={ this._goToLaunchScreen } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});