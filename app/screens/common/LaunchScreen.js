/**
 * @flow
 *
 * This is the very first screen that opens
 * when your app starts. This is where you
 * check for existing auth sessions and decide
 * what would the next step be. Either enter the
 * application content or navigate the user to the
 * Login screen.
 */

import React, { Component }                                 from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';

/** Types */
import type { StackNavigation }                             from '../../../types/Navigation';

/** Utilities */
import Preferences                                          from '../../../backend/Preferences';

type Props = {
  screenProps: { isTablet: boolean },
  navigation: StackNavigation<any>
}

export default class LaunchScreen extends Component<Props> {

  componentDidMount() {
    setTimeout(this._getNextScreen, 1000); // act like we're doing some magic
  }

  _getNextScreen = async () => {
    try {
      const { screenProps: { isTablet } } = this.props;
      const token = await Preferences.getToken();

      if (!token) return this.props.navigation.navigate('Auth');

      if (isTablet) this.props.navigation.navigate('Tablet');
      else this.props.navigation.navigate('Mobile');
    } catch (e) { this._handleErrors(e); }
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
        <Text>Loading...</Text>
        <ActivityIndicator />
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