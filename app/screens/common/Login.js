/**
 * @flow
 *
 * This screen is the only Auth screen for this demo
 * for obvious reasons I'm not implementing any actual
 * logging in functionality, so by pressing login we
 * just set a dummy token "token' and switch to the
 * rest of the app.
 */

import React, { Component }                from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';

/** Types */
import type { Navigation }                 from '../../../types/Navigation';

/** Utilities */
import Preferences                         from '../../../backend/Preferences';

/** Utilities */

type Props = {
  screenProps: { isTablet: boolean },
  navigation: Navigation<any>
}

export default class Login extends Component<Props> {

  /** Button Handlers */

  _login = () => {
    const { screenProps: { isTablet } } = this.props;

    Preferences.setToken('token')
      .then(() => {
        if (isTablet) this.props.navigation.navigate('Tablet');
        else this.props.navigation.navigate('Mobile');
        return true;
      })
      .catch(this._handleErrors);
  };

  /** Generic Handlers */

  _handleErrors = (e: Error) => {
    const buttons = [{ text: 'OK', type: 'cancel' }];
    Alert.alert('Error', e.message, buttons);
  };

  /** Renderers */

  render() {
    return (
      <View style={ styles.container }>
        <Button title='Login and go to Home' onPress={ this._login } />
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